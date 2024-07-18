import {
  Controller,
  Request,
  Post,
  Get,
  UseGuards,
  Body,
  Put,
  UseInterceptors,
  UploadedFile,
  Param,
  Req
} from "@nestjs/common"
import {FileInterceptor} from "@nestjs/platform-express"
import {User, UserDocument} from "src/users/users.schema"
import {GoogleAuthGuard, LocalAuthGuard} from "./auth.guard"
import {Public} from "./auth.decorators"
import {AuthService, UserFromToken} from "./auth.service"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("signup")
  async signup(@Body() user: Pick<UserDocument, "email" | "password">) {
    user.email = user.email.toLowerCase()
    return this.authService.signup(user)
  }

  @Public()
  @Post("signup-without-password")
  async signupWithoutPassword(
    @Req() req: Request,
    @Body() user: Pick<UserDocument, "email" | "firstName" | "lastName">
  ) {
    user.email = user.email.toLowerCase()
    return this.authService.signupWithoutPassword(
      user,
      req.headers[process.env.REQ_HEADERS_LOCALE] || "en"
    )
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req) {
    req.user.email = req.user.email.toLowerCase()
    return this.authService.login(req.user)
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Post("login-google")
  async loginGoogle(@Request() req) {
    req.user.email = req.user.email.toLowerCase()
    return this.authService.loginGoogle(
      req.user,
      req.headers[process.env.REQ_HEADERS_LOCALE] || "en"
    )
  }

  @Get("profile")
  async getProfile(@Request() req: { user: UserFromToken }) {
    const user = await this.authService.getProfile(req.user._id)

    if (!user) {
      return null
    }

    return user
  }

  @Public()
  @Get("profile/:email")
  async getProfileByEmail(@Param("email") email: string) {
    const user = await this.authService.getProfileByEmail(email.toLowerCase())

    if (!user) {
      return null
    }

    return user
  }

  @Put("profile")
  @UseInterceptors(FileInterceptor("avatar"))
  async updateProfile(
    @Request() req: Request & { user: UserFromToken },
    @Body()
    body: Partial<
      User & {
        newPassword: string
      }
    >,
    @UploadedFile() avatar: Express.Multer.File
  ) {
    body.email && (body.email = body.email.toLowerCase())
    return await this.authService.updateProfile(req.user._id, req.headers[process.env.REQ_HEADERS_LOCALE] || "en", body, avatar)
  }

  @Get("send-verification-email")
  async sendVerificationEmail(@Request() req: { user: UserFromToken }) {
    return await this.authService.resendVerificationEmail(req.user._id)
  }

  @Public()
  @Get("verify-email/:token")
  async verifyEmail(@Param("token") token: string) {
    return await this.authService.verifyEmail(token)
  }

  @Public()
  @Post("recovery-password")
  async recoveryPasswordEmail(@Req() req: Request, @Body() input: { email: string }) {
    return await this.authService.recoveryPasswordEmail(
      input.email.toLowerCase(),
      req.headers[process.env.REQ_HEADERS_LOCALE] || "en"
    )
  }

  @Public()
  @Post("recovery-password/:token")
  async recoveryPasswordEmailResetPassword(
    @Req() req: Request,
    @Body() input: { newPassword: string },
    @Param("token") token: string
  ) {
    return await this.authService.recoveryPasswordEmailResetPassword(
      token,
      input.newPassword,
      req.headers[process.env.REQ_HEADERS_LOCALE] || "en"
    )
  }
}
