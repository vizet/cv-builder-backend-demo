import {Injectable} from "@nestjs/common"
import {ConfigService} from "@nestjs/config"
import * as sgMail from "@sendgrid/mail"

@Injectable()
export class EmailService {
  constructor(
    private configService: ConfigService
  ) {
    sgMail.setApiKey(this.configService.get("sendGrid.apiKey"))
  }

  async sendVerificationEmail(
    email: string,
    token: string,
    locale: string
  ) {
    try {
      await sgMail.send({
        to: email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: this.configService.get(`sendGrid.templates.${locale}.emailConfirm`),
        dynamicTemplateData: {
          "url": `${this.configService.get("frontendUrl")}/auth/verify-email?token=${token}`
                }
      })
    } catch (err) {
      console.error(err)
    }

    return
  }

  async sendContactUsEmail(input: {
    name: string
    email: string
    subject: string
    summary: string
  }, locale: string) {
    try {
      await sgMail.send({
        // to: this.configService.get("sendGrid.emailFrom"),
        to: "alexey.bagishev.dev@gmail.com",
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: this.configService.get(`sendGrid.templates.${locale}.emailContactUs`),
        dynamicTemplateData: {
          ...input
        }
      })
    } catch (err) {
      console.error(err)
    }

    return
  }

  async sendRecoveryPasswordEmail(input: {
    email: string
    name: string
    token: string
  }, locale: string) {
    try {
      await sgMail.send({
        to: input.email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: this.configService.get(`sendGrid.templates.${locale}.emailRecoveryPassword`),
        dynamicTemplateData: {
          name: input.name,
          button_url: `${this.configService.get("frontendUrl")}/auth/recover?token=${input.token}`
        }
      })
    } catch (err) {
      console.error(err)
    }

    return
  }

  async sendRecoveryPasswordSuccessfulEmail(input: {
    email: string
    name: string
  }, locale: string) {
    try {
      await sgMail.send({
        to: input.email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: this.configService.get(`sendGrid.templates.${locale}.emailRecoveryPasswordSuccessful`),
        dynamicTemplateData: {
          name: input.name,
          button_url: `${this.configService.get("frontendUrl")}/auth/login`
        }
      })
    } catch (err) {
      console.error(err)
    }

    return
  }

  async sendSignUpWithEmailSuccessfulEmail(input: {
    email: string
    name: string
    generated_password: string
  }, locale: string) {
    try {
      await sgMail.send({
        to: input.email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: this.configService.get(`sendGrid.templates.${locale}.emailSignUpWithEmailSuccessful`),
        dynamicTemplateData: {
          user_name: input.name,
          user_email: input.email,
          generated_password: input.generated_password,
          button_url: `${this.configService.get("frontendUrl")}/auth/login`
        }
      })
    } catch (err) {
      console.error(err)
    }

    return
  }

  async sendSignUpWithGoogleSuccessfulEmail(input: {
    email: string
    name: string
  }, locale: string) {
    try {
      await sgMail.send({
        to: input.email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: this.configService.get(`sendGrid.templates.${locale}.emailSignUpWithGoogleSuccessful`),
        dynamicTemplateData: {
          user_name: input.name,
          button_url: `${this.configService.get("frontendUrl")}/auth/login`
        }
      })
    } catch (err) {
      console.error(err)
    }

    return
  }

  async sendAccountSubscriptionCancellationEmail(input: {
    email: string
    name: string
    expiresDate:string
  }, locale: string) {
    try {
      await sgMail.send({
        to: input.email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: this.configService.get(`sendGrid.templates.${locale}.emailAccountSubscriptionCancelation`),
        dynamicTemplateData: {
          user_name: input.name,
          expires_date: input.expiresDate,
          button_url: `${this.configService.get("frontendUrl")}/auth/login`
        }
      })
    } catch (err) {
      console.error(err)
    }

    return
  }

  async sendAccountInitialPaymentEmail(input: {
    email: string
    name: string
    trialPeriod: number
    price: string
    trialExpiresDate?: string
  }, locale: string) {
    try {
      await sgMail.send({
        to: input.email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: this.configService.get(`sendGrid.templates.${locale}.emailAccountInitialPayment`),
        dynamicTemplateData: {
          user_name: input.name,
          trial_period_days: input.trialPeriod || 0,
          trial_expires_date: input.trialExpiresDate,
          price: input.price,
          button_url: `${this.configService.get("frontendUrl")}/auth/login`
        }
      })
    } catch (err) {
      console.error(err)
    }

    return
  }

  async sendReminder1stEmail(input: {
    email: string
    name: string
    locale: string
  }){
    try {
      const templateWithLocale = this.configService.get(`sendGrid.templates.${input.locale.toLocaleLowerCase()}.emailReminder1st`) || this.configService.get("sendGrid.templates.en.emailReminder1st")

      await sgMail.send({
        to: input.email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: templateWithLocale,
        dynamicTemplateData: {
          user_name: input.name,
          button_url: `${this.configService.get("frontendUrl")}/dashboard?utm_source=reminder_email_1st&utm_medium=reminder_email_1st&utm_campaign=reminder_email_1st`
        }
      })
    } catch (err) {
      console.error(err)
      
    }
  }
}
