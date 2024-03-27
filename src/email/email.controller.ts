import {Body, Controller, Post} from "@nestjs/common"
import {Public} from "src/auth/auth.decorators"
import {EmailService} from "./email.service"

@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Public()
  @Post("contact-us")
  sendContactUsEmail(
    @Body() input: { name: string, email: string, subject: string, summary: string }
  ) {
    return this.emailService.sendContactUsEmail(input)
  }
}
