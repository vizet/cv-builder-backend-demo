import {
  Controller,
  Request,
  Post,
  Get,
  UseGuards,
  Body
} from "@nestjs/common"
import {UserDocument} from "src/users/users.schema"
import {GoogleAuthGuard, LocalAuthGuard} from "./auth.guard"
import {Public} from "./auth.decorators"
import {AuthService} from "./auth.service"

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
  async getProfile(@Request() req) {
    const user = await this.authService.getProfile(req.user)

    if (!user) {
      return null
    }

    return user
  }
}
