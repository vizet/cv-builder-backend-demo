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
    locale?: string
  ) {
    const templateWithLocale = this.configService.get(`sendGrid.templates.${locale?.toLocaleLowerCase()}.emailConfirm`) || this.configService.get("sendGrid.templates.en.emailConfirm")

    try {
      await sgMail.send({
        to: email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: templateWithLocale,
        dynamicTemplateData: {
          "url": `${this.configService.get("frontendUrl")}/auth/verify-email?token=${token}`
        },
        asm: this.configService.get("sendGrid.unsubscribeAsm")
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
  }) {
    try {
      const templateWithLocale = this.configService.get("sendGrid.templates.en.emailContactUs")

      const res = await sgMail.send({
        to: "support@cvwisely.com",
        from: {
          email: "no-reply@cvwisely.com"
        },
        templateId: templateWithLocale,
        dynamicTemplateData: {
          ...input
        },
        asm: this.configService.get("sendGrid.unsubscribeAsm")
      })

      console.log({res})
    } catch (err) {
      console.error(err)
    }

    return
  }

  async sendRecoveryPasswordEmail(input: {
    email: string
    name: string
    token: string
  }, locale?: string) {
    try {
      const templateWithLocale = this.configService.get(`sendGrid.templates.${locale?.toLocaleLowerCase()}.emailRecoveryPassword`) || this.configService.get("sendGrid.templates.en.emailRecoveryPassword")

      await sgMail.send({
        to: input.email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: templateWithLocale,
        dynamicTemplateData: {
          user_name: input.name,
          button_url: `${this.configService.get("frontendUrl")}/auth/recover?token=${input.token}`
        },
        asm: this.configService.get("sendGrid.unsubscribeAsm")
      })
    } catch (err) {
      console.error(err.response.body)
    }

    return
  }

  async sendRecoveryPasswordSuccessfulEmail(input: {
    email: string
    name: string
  }, locale?: string) {
    try {
      const templateWithLocale = this.configService.get(`sendGrid.templates.${locale?.toLocaleLowerCase()}.emailRecoveryPasswordSuccessful`) || this.configService.get("sendGrid.templates.en.emailRecoveryPasswordSuccessful")

      await sgMail.send({
        to: input.email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: templateWithLocale,
        dynamicTemplateData: {
          user_name: input.name,
          button_url: `${this.configService.get("frontendUrl")}/auth/login`
        },
        asm: this.configService.get("sendGrid.unsubscribeAsm")
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
  }, locale?: string) {
    try {
      const templateWithLocale = this.configService.get(`sendGrid.templates.${locale?.toLocaleLowerCase()}.emailSignUpWithEmailSuccessful`) || this.configService.get("sendGrid.templates.en.emailSignUpWithEmailSuccessful")
      
      await sgMail.send({
        to: input.email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: templateWithLocale,
        dynamicTemplateData: {
          user_name: input.name,
          user_email: input.email,
          generated_password: input.generated_password,
          button_url: `${this.configService.get("frontendUrl")}/auth/login`
        },
        asm: this.configService.get("sendGrid.unsubscribeAsm")
      })
    } catch (err) {
      console.error(err)
    }

    return
  }

  async sendSignUpWithGoogleSuccessfulEmail(input: {
    email: string
    name: string
  }, locale?: string) {
    try {
      const templateWithLocale = this.configService.get(`sendGrid.templates.${locale?.toLocaleLowerCase()}.emailSignUpWithGoogleSuccessful`) || this.configService.get("sendGrid.templates.en.emailSignUpWithGoogleSuccessful")

      await sgMail.send({
        to: input.email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: templateWithLocale,
        dynamicTemplateData: {
          user_name: input.name,
          button_url: `${this.configService.get("frontendUrl")}/auth/login`
        },
        asm: this.configService.get("sendGrid.unsubscribeAsm")
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
  }, locale?: string) {
    try {
      const templateWithLocale = this.configService.get(`sendGrid.templates.${locale?.toLocaleLowerCase()}.emailAccountSubscriptionCancelation`) || this.configService.get("sendGrid.templates.en.emailAccountSubscriptionCancelation")
      
      await sgMail.send({
        to: input.email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: templateWithLocale,
        dynamicTemplateData: {
          user_name: input.name,
          expires_date: input.expiresDate,
          button_url: `${this.configService.get("frontendUrl")}/auth/login`
        },
        asm: this.configService.get("sendGrid.unsubscribeAsm")
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
  }, locale?: string) {
    try {
      const templateWithLocale = this.configService.get(`sendGrid.templates.${locale?.toLocaleLowerCase()}.emailAccountInitialPayment`) || this.configService.get("sendGrid.templates.en.emailAccountInitialPayment")

      await sgMail.send({
        to: input.email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: templateWithLocale,
        dynamicTemplateData: {
          user_name: input.name,
          trial_period_days: input.trialPeriod || 0,
          trial_expires_date: input.trialExpiresDate,
          price: input.price,
          button_url: `${this.configService.get("frontendUrl")}/auth/login`
        },
        asm: this.configService.get("sendGrid.unsubscribeAsm")
      })
    } catch (err) {
      console.error(err)
    }

    return
  }

  async sendReminder1stEmail(input: {
    email: string
    name: string
    locale?: string
  }){
    try {
      const templateWithLocale = this.configService.get(`sendGrid.templates.${input.locale?.toLocaleLowerCase()}.emailReminder1st`) || this.configService.get("sendGrid.templates.en.emailReminder1st")

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
        },
        asm: this.configService.get("sendGrid.unsubscribeAsm")
      })
    } catch (err) {
      console.error(err)
      
    }
  }

  async sendReminder2stEmail(input: {
    email: string
    name: string
    locale?: string
  }){
    try {
      const templateWithLocale = this.configService.get(`sendGrid.templates.${input.locale?.toLocaleLowerCase()}.emailReminder2st`) || this.configService.get("sendGrid.templates.en.emailReminder2st")

      await sgMail.send({
        to: input.email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: templateWithLocale,
        dynamicTemplateData: {
          user_name: input.name,
          button_url: `${this.configService.get("frontendUrl")}/dashboard?utm_source=reminder_email_2st&utm_medium=reminder_email_2st&utm_campaign=reminder_email_2st`
        },
        asm: this.configService.get("sendGrid.unsubscribeAsm")
      })
    } catch (err) {
      console.error(err)
      
    }
  }
}
