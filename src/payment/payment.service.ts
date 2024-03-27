import {
  BadRequestException, forwardRef, Inject,
  Injectable, UnauthorizedException
} from "@nestjs/common"
import {ConfigService} from "@nestjs/config"
import {UsersService} from "src/users/users.service"
import Stripe from "stripe"

@Injectable()
export class PaymentService {
  private stripe: Stripe

  constructor(
    configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService
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

  async getMethods(userId: string) {
    try {
      const customer = await this.getCustomer(userId)
      const paymentMethods = await this.stripe.customers.listPaymentMethods(customer.id)

      return paymentMethods.data.map(i => {
        const object: {
          id: string
          type: string
          dateCreated: string
          isDefault: boolean
          card?: {
            brand: string
            displayBrand: string
            last4: string
          }
          sepa_debit?: {
            bank_code: string
            last4: string
          }
          paypal?: {email: string
          }
        } = {
          id: i.id,
          type: i.type,
          dateCreated: new Date(i.created).toISOString(),
          isDefault: "invoice_settings" in customer && i.id === customer.invoice_settings.default_payment_method
        }

        if ("card" in i) {
          object.card = {
            brand: i.card.brand,
            displayBrand: i.card.display_brand,
            last4: i.card.last4
          }
        } else if ("sepa_debit" in i) {
          object.sepa_debit = {
            bank_code: i.sepa_debit.bank_code,
            last4: i.sepa_debit.last4
          }
        } else if ("paypal" in i) {
          object.paypal = {
            email: i.paypal.payer_email
          }
        }

        return object
      })
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
        payment_method_types: [
          "card",
          "sepa_debit",
          "paypal"
          // "google_pay"
        ]
      })

      return {
        secret: intentRes.client_secret
      }
    } catch (err) {
      console.error(err)
      throw new BadRequestException("Something went wrong")
    }
  }

  async deleteMethod(
    paymentMethodId: string
  ) {
    try {
      await this.stripe.paymentMethods.detach(paymentMethodId)

      return {
        success: true
      }
    } catch (err) {
      console.error(err)
      throw new BadRequestException("Something went wrong")
    }
  }

  async setDefaultMethod(
    userId: string,
    paymentMethodId: string
  ) {
    try {
      const customerId = await this.getCustomerId(userId)

      await this.stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      })

      return {
        success: true
      }
    } catch (err) {
      console.error(err)
      throw new BadRequestException("Something went wrong")
    }
  }

  async buySubscription(
    userId: string,
    input: {
      paymentMethodId: string
    }
  ) {
    try {
      const customerId = await this.getCustomerId(userId)

      const prices = await this.stripe.prices.list()
      const oneTimePrice = prices.data.find(i => i.type === "one_time")
      const reccuringPrice = prices.data.find(i => i.type === "recurring")

      if (!oneTimePrice) {
        throw new BadRequestException("Can't find product one time price")
      }

      if (!reccuringPrice) {
        throw new BadRequestException("Can't find product reccuring price")
      }

      const invoice = await this.stripe.invoices.create({
        customer: customerId,
        default_payment_method: input.paymentMethodId
      })

      await this.stripe.invoiceItems.create({
        invoice: invoice.id,
        customer: customerId,
        price: oneTimePrice.id
      })
      await this.stripe.invoices.finalizeInvoice(invoice.id)
      await this.stripe.invoices.pay(invoice.id)

      const futureTimestamp = Math.floor((Date.now() + 1000 * 60 * 60 * 24 * 14) / 1000)

      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{price: reccuringPrice.id}],
        billing_cycle_anchor: futureTimestamp,
        trial_end: futureTimestamp
      })

      await this.usersService.updateSubscription(userId, {
        subscriptionId: subscription.id,
        isActive: true
      })

      return {
        success: true
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

      await this.stripe.subscriptions.cancel(user.subscription.subscriptionId)

      await this.usersService.updateSubscription(userId, {
        subscriptionId: null,
        isActive: false
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
