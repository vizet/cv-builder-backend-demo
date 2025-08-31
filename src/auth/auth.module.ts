import {forwardRef, Module} from "@nestjs/common"
import {PassportModule} from "@nestjs/passport"
import {EmailModule} from "src/email/email.module"
import {PaymentModule} from "src/payment/payment.module"
import {LocalStrategy} from "./local.strategy"
import {JwtStrategy} from "./jwt.strategy"
import {AuthController} from "./auth.controller"
import {AuthService} from "./auth.service"
import {UsersModule} from "src/users/users.module"

@Module({
  imports: [
    EmailModule,
    forwardRef(() => UsersModule),
    PaymentModule,
    PassportModule
  ],
  providers: [
    LocalStrategy,
    JwtStrategy,
    AuthService
  ],
  controllers: [AuthController],
  exports: [AuthService]
})

export class AuthModule {}
