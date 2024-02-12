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
  Param
} from "@nestjs/common"
import {FileInterceptor} from "@nestjs/platform-express"
import {User, UserDocument} from "src/users/users.schema"
import {GoogleAuthGuard, LocalAuthGuard} from "./auth.guard"
import {Public} from "./auth.decorators"
import {AuthService, UserFromToken} from "./auth.service"

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Public()
  @Post("signup")
  async signup(@Body() user: Pick<UserDocument, "email" | "password">) {
    return this.authService.signup(user)
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Post("login-google")
  async loginGoogle(@Request() req) {
    return this.authService.loginGoogle(req.user)
  }

  @Get("profile")
  async getProfile(@Request() req: {user: UserFromToken}) {
    const user = await this.authService.getProfile(req.user._id)

    if (!user) {
      return null
    }

    return user
  }

  @Put("profile")
  @UseInterceptors(FileInterceptor("avatar"))
  async updateProfile(
    @Request() req: {user: UserFromToken},
    @Body() body: Partial<User & {
      newPassword: string
    }>,
    @UploadedFile() avatar: Express.Multer.File
  ) {
    return await this.authService.updateProfile(req.user._id, body, avatar)
  }

  @Get("send-verification-email")
  async sendVerificationEmail(
    @Request() req: {user: UserFromToken}
  ) {
    return await this.authService.resendVerificationEmail(req.user._id)
  }

  @Public()
  @Get("verify-email/:token")
  async verifyEmail(
    @Param("token") token: string
  ) {
    return await this.authService.verifyEmail(token)
  }
}
