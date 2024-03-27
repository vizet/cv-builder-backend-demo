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
}
