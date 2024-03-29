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
        from: this.configService.get("sendGrid.emailFrom"),
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
        from: this.configService.get("sendGrid.emailFrom"),
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
        from: this.configService.get("sendGrid.emailFrom"),
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
        from: this.configService.get("sendGrid.emailFrom"),
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
}
