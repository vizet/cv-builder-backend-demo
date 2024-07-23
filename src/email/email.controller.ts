import {Body, Controller, Post, Req} from "@nestjs/common"
import {Public} from "src/auth/auth.decorators"
import {EmailService} from "./email.service"

@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Public()
  @Post("contact-us")
  sendContactUsEmail(
    @Req() req: Request,
    @Body() input: { name: string, email: string, subject: string, summary: string }
  ) {
    input.email = input.email.toLowerCase()
    return this.emailService.sendContactUsEmail(input)
  }
}
