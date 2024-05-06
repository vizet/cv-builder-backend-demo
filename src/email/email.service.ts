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
    token: string
  ) {
    try {
      await sgMail.send({
        to: email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: this.configService.get("sendGrid.templates.emailConfirm"),
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
  }) {
    try {
      await sgMail.send({
        to: this.configService.get("sendGrid.emailFrom"),
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: this.configService.get("sendGrid.templates.emailContactUs"),
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
  }) {
    try {
      await sgMail.send({
        to: input.email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: this.configService.get("sendGrid.templates.emailRecoveryPassword"),
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
  }) {
    try {
      await sgMail.send({
        to: input.email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: this.configService.get("sendGrid.templates.emailRecoveryPasswordSuccessful"),
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
  }) {
    try {
      await sgMail.send({
        to: input.email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: this.configService.get("sendGrid.templates.emailSignUpWithEmailSuccessful"),
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
  }) {
    try {
      await sgMail.send({
        to: input.email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: this.configService.get("sendGrid.templates.emailSignUpWithGoogleSuccessful"),
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

  async sendAccountSubscriptionCancelationEmail(input: {
    email: string
    name: string
    expiresDate:string
  }) {
    try {
      await sgMail.send({
        to: input.email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: this.configService.get("sendGrid.templates.emailAccountSubscriptionCancelation"),
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
    price: string
    trialExpiresDate:string
  }) {
    try {
      await sgMail.send({
        to: input.email,
        from: {
          email: this.configService.get("sendGrid.emailFrom"),
          name: this.configService.get("sendGrid.emailFromName")
        },
        templateId: this.configService.get("sendGrid.templates.emailAccountInitialPayment"),
        dynamicTemplateData: {
          user_name: input.name,
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
}
