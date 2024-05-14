import {
  BadRequestException, forwardRef, Inject,
  Injectable, UnauthorizedException
} from "@nestjs/common"
import {ConfigService} from "@nestjs/config"
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

      if (!user.customerId) {
        const customer = await this.stripe.customers.create({
          name: user.fullName,
          email: user.email || "",
          metadata: {
            "_id": userId
          }
        })

        user.customerId = customer.id

        await user.save()
      }

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

      return await this.stripe.customers.retrieve(customerId)
    } catch (err) {
      console.error(err)
      throw new BadRequestException("Something went wrong")
    }
  }

  async getPricing(
    userId: string
  ) {
    try {
      const user = await this.usersService.findOne({
        userId
      })

      const countryPrice = countriesPriceData.find(i => i.country === user.country) || countriesPriceData[0]
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
      const user = await this.usersService.findOne({userId})

      const customerId = await this.getCustomerId(userId)
      const paymentMethods = await this.stripe.customers.listPaymentMethods(customerId)
      const prices = await this.getPricing(userId)
      const lastPaymentMethod = paymentMethods.data.sort((a, b) => b.created - a.created)[0]

      await this.stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: lastPaymentMethod.id
        }
      })

      const invoice = await this.stripe.invoices.create({
        customer: customerId,
        currency: prices.currency,
        default_payment_method: lastPaymentMethod.id
      })

      await this.stripe.invoiceItems.create({
        invoice: invoice.id,
        customer: customerId,
        currency: prices.currency,
        price: prices.trial.id
      })
      await this.stripe.invoices.finalizeInvoice(invoice.id)
      const paidInvoice = await this.stripe.invoices.pay(invoice.id)

      const futureTimestamp = Math.floor((Date.now() + 1000 * 60 * 60 * 24 * prices.trial.period) / 1000)

      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        currency: prices.currency,
        items: [{price: prices.subscription.id}],
        billing_cycle_anchor: futureTimestamp,
        trial_end: futureTimestamp
      })

      await this.usersService.updateSubscription(userId, {
        subscriptionId: subscription.id,
        isActive: true
      })

      const price = `€${prices.subscription.amount}`
      const trialExpiresDate = format(new Date(subscription.current_period_end * 1000), "dd MMM yyyy")

      await this.emailService.sendAccountInitialPaymentEmail({
        email: user.email,
        name: user.fullName,
        price,
        trialExpiresDate
      })

      return {
        success: true,
        data: {
          transaction_id: paidInvoice.payment_intent,
          currency: paidInvoice.currency,
          value: paidInvoice.amount_paid,
          customer: {
            id: paidInvoice.customer,
            customer_email: paidInvoice.customer_email,
            customer_name: paidInvoice.customer_name
          },
          items: [
            {
              item_id: prices.trial.id,
              item_name: "Trial",
              affiliation: paidInvoice.account_name
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
    subscriptionId: string
  ) {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId)

      return ["active", "trialing"].includes(subscription.status)
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

      const sub = await this.stripe.subscriptions.cancel(user.subscription.subscriptionId)

      await this.usersService.updateSubscription(userId, {
        subscriptionId: null,
        isActive: false
      })

      if (sub) {
        const expiresDate = format(new Date(sub.current_period_end * 1000), "dd MMM yyyy")

        await this.emailService.sendAccountSubscriptionCancelationEmail({email: user.email, name: user.fullName, expiresDate})
      }

      return {
        success: true
      }
    } catch (err) {
      console.error(err)
      throw new BadRequestException("Something went wrong")
    }
  }
}
