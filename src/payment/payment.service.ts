import {
  BadRequestException, forwardRef, Inject,
  Injectable, UnauthorizedException
} from "@nestjs/common"
import {ConfigService} from "@nestjs/config"
import {User} from "src/users/users.schema"
import Stripe from "stripe"
import {format} from "date-fns"
import {UsersService} from "src/users/users.service"
import {EmailService} from "src/email/email.service"
import * as countriesPriceData from "./countriesPriceData.json"

@Injectable()
export class PaymentService {
  private stripe: Stripe

  constructor(
    configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private emailService: EmailService
  ) {
    this.stripe = new Stripe(configService.get("stripe.secretKey"))
  }

  private async getCustomerId(
    userId: string
  ) {
    try {
      const user = await this.usersService.findOne({
        userId
      }, {
        pickCustomerId: true,
        object: false
      })

      const createNew = async () => {
        return await this.stripe.customers.create({
          name: user.fullName,
          email: user.email || "",
          metadata: {
            "_id": userId
          }
        })
      }

      let customer: Stripe.Response<Stripe.Customer>

      if (!user.customerId) {
        customer = await createNew()
      } else {
        customer = await this.stripe.customers.retrieve(user.customerId).catch(() => {
          return null
        })

        if (!customer || customer.deleted as unknown as boolean) {
          customer = await createNew()
        }
      }

      user.customerId = customer.id

      await user.save()

      return user.customerId
    } catch (err) {
      console.error(err)
      throw new BadRequestException("Something went wrong")
    }
  }

  private async getCustomer(
    userId: string
  ) {
    try {
      const customerId = await this.getCustomerId(userId)

      return await this.stripe.customers.retrieve(customerId) as Stripe.Response<Stripe.Customer>
    } catch (err) {
      console.error(err)
      throw new BadRequestException("Something went wrong")
    }
  }

  async getPricing(
    userId?: string,
    country?: string
  ) {
    try {
      let userCountry = country

      if (userId) {
        const user = await this.usersService.findOne({
          userId
        })

        userCountry = user.country
      }

      const countryPrice = countriesPriceData.find(i => i.country === userCountry) || countriesPriceData[0]
      const pricesRes = await this.stripe.prices.search({
        query: `lookup_key:'${countryPrice.key}_trial' OR lookup_key:'${countryPrice.key}_sub'`
      })
      const pricesList = pricesRes.data.filter(i => i.active)
      const prices = {
        trial: pricesList.find(i => i.type === "one_time"),
        subscription: pricesList.find(i => i.type === "recurring")
      }

      return {
        currency: prices.trial.currency,
        trial: {
          id: prices.trial.id,
          period: countryPrice.trialDays,
          amount: (prices.trial.unit_amount / 100).toFixed(2),
          description: prices.trial.nickname
        },
        subscription: {
          id: prices.subscription.id,
          amount: (prices.subscription.unit_amount / 100).toFixed(2),
          description: prices.subscription.nickname
        }
      }
    } catch (err) {
      console.error(err)
      throw new BadRequestException("Something went wrong")
    }
  }

  async createIntent(
    userId: string
  ) {
    try {
      const customerId = await this.getCustomerId(userId)
      const intentRes = await this.stripe.setupIntents.create({
        customer: customerId,
        automatic_payment_methods: {
          enabled: true
        }
      })

      return {
        secret: intentRes.client_secret
      }
    } catch (err) {
      console.error(err)
      throw new BadRequestException("Something went wrong")
    }
  }

  async buySubscription(
    userId: string
  ) {
    try {
      const user = await this.usersService.findOne({userId}, {
        pickCustomerId: true,
        pickSubscriptionData: true
      })

      const customer = await this.getCustomer(userId)
      const paymentMethods = await this.stripe.customers.listPaymentMethods(customer.id)
      const prices = await this.getPricing(userId)
      const lastPaymentMethod = paymentMethods.data.sort((a, b) => b.created - a.created)[0]

      await this.stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: lastPaymentMethod.id
        }
      })

      const trialEnded = user.subscription.trialExpiryDate && (
        user.subscription.trialExpiryDate.getTime() <= new Date().getTime()
      )
      const futureTimestamp = Math.floor((Date.now() + 1000 * 60 * 60 * 24 * prices.trial.period) / 1000)

      let paidInvoice: Stripe.Response<Stripe.Invoice> = null
      let subscription: Stripe.Response<Stripe.Subscription>

      if (!user.subscription.subscriptionId) {
        const invoice = await this.stripe.invoices.create({
          customer: customer.id,
          currency: prices.currency,
          default_payment_method: lastPaymentMethod.id
        })

        await this.stripe.invoiceItems.create({
          invoice: invoice.id,
          customer: customer.id,
          currency: prices.currency,
          price: prices.trial.id
        })

        await this.stripe.invoices.finalizeInvoice(invoice.id)

        paidInvoice = await this.stripe.invoices.pay(invoice.id)
        subscription = await this.stripe.subscriptions.create({
          customer: customer.id,
          currency: prices.currency,
          items: [{price: prices.subscription.id}],
          billing_cycle_anchor: futureTimestamp,
          trial_end: futureTimestamp
        })

        await this.usersService.updateSubscription(userId, {
          subscriptionId: subscription.id,
          isActive: true,
          canceled: false,
          trialExpiryDate: new Date(futureTimestamp * 1000)
        })

        const price = `${prices.subscription.description}`
        const trialExpiryDate = format(new Date(futureTimestamp * 1000), "dd MMM yyyy")

        await this.emailService.sendAccountInitialPaymentEmail({
          email: user.email,
          name: user.fullName,
          trialPeriod: prices.trial.period,
          price,
          trialExpiresDate: trialExpiryDate
        })
      } else {
        subscription = await this.stripe.subscriptions.retrieve(user.subscription.subscriptionId)

        if (["active", "trialing"].includes(subscription.status) && subscription.cancel_at) {
          subscription = await this.stripe.subscriptions.update(subscription.id, {
            cancel_at: null
          })
        } else {
          subscription = await this.stripe.subscriptions.create({
            customer: customer.id,
            currency: prices.currency,
            items: [{price: prices.subscription.id}]
          })
        }

        await this.usersService.updateSubscription(userId, {
          subscriptionId: subscription.id,
          isActive: true,
          canceled: false
        })
      }

      return {
        success: true,
        data: {
          transaction_id: trialEnded ? subscription.latest_invoice : paidInvoice?.payment_intent,
          currency: prices.currency,
          value: trialEnded ? parseFloat(prices.subscription.amount) : paidInvoice?.amount_paid,
          customer: {
            id: customer.id,
            customer_email: customer.email || "",
            customer_name: customer.name || ""
          },
          items: [
            {
              item_id: trialEnded ? prices.subscription.id : prices.trial.id,
              item_name: trialEnded ? "Subscription" : "Trial",
              affiliation: paidInvoice?.account_name || "CVwisely.com"
            }
          ]
        }
      }
    } catch (err) {
      console.error(err)
      throw new BadRequestException("Something went wrong")
    }
  }

  async checkSubscription(
    userId: string,
    userSubscription: Partial<User["subscription"]> | null
  ) {
    try {
      if (!userSubscription.subscriptionId) {
        return {
          isActive: userSubscription.isActive,
          canceled: userSubscription.canceled,
          trialExpiryDate: userSubscription.trialExpiryDate
        }
      }

      const subscription = await this.stripe.subscriptions.retrieve(userSubscription.subscriptionId)
      const isActive = ["active", "trialing"].includes(subscription.status)

      if (isActive !== userSubscription.isActive) {
        await this.usersService.updateSubscription(userId, {
          isActive
        })
      }

      return {
        isActive,
        canceled: userSubscription.canceled,
        trialExpiryDate: userSubscription.trialExpiryDate
      }
    } catch (err) {
      console.error(err)
      throw new BadRequestException("Something went wrong")
    }
  }

  async cancelSubscription(
    userId: string
  ) {
    try {
      const user = await this.usersService.findOne({
        userId
      }, {
        object: false,
        pickSubscriptionData: true
      })

      if (!user?.subscription.subscriptionId) {
        throw new UnauthorizedException("Unable to find user")
      }

      let trialEnded = Boolean(user.subscription.trialExpiryDate && (
        user.subscription.trialExpiryDate.getTime() <= new Date().getTime()
      ))
      let cancelTimestamp: number

      if (trialEnded) {
        const subscription = await this.stripe.subscriptions.retrieve(user.subscription.subscriptionId)

        cancelTimestamp = subscription.current_period_end
      } else {
        cancelTimestamp = user.subscription.trialExpiryDate.getTime() / 1000
      }

      const sub = await this.stripe.subscriptions.update(user.subscription.subscriptionId, {
        cancel_at: cancelTimestamp
      })

      await this.usersService.updateSubscription(userId, {
        subscriptionId: user.subscription.subscriptionId,
        isActive: false,
        canceled: true
      })

      const subscriptionPeriodEnd = new Date(sub.current_period_end * 1000)
      const expiryDate = format(subscriptionPeriodEnd, "dd MMM yyyy")

      await this.emailService.sendAccountSubscriptionCancellationEmail({
        email: user.email,
        name: user.fullName,
        expiresDate: expiryDate
      })

      return {
        success: true
      }
    } catch (err) {
      console.error(err)
      throw new BadRequestException("Something went wrong")
    }
  }
}
