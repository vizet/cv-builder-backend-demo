import {Module} from "@nestjs/common"
import {ConfigService} from "@nestjs/config"
import {JwtModule} from "@nestjs/jwt"
import {PassportModule} from "@nestjs/passport"
import {LocalStrategy} from "./local.strategy"
import {JwtStrategy} from "./jwt.strategy"
import {AuthController} from "./auth.controller"
import {AuthService} from "./auth.service"
import {UsersModule} from "src/users/users.module"

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("jwtSecret"),
        signOptions: {
          expiresIn: "30d"
        }
      })
    })
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy
  ],
  controllers: [AuthController],
  exports: [AuthService]
})

export class AuthModule {}
