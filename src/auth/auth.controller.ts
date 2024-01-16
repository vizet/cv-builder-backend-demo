import {
  Controller,
  Request,
  Post,
  Get,
  UseGuards,
  Body
} from "@nestjs/common"
import {UserDocument} from "src/users/users.schema"
import {LocalAuthGuard} from "./auth.guard"
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

  @Get("profile")
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user)
  }
}
