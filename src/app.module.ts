import {Module} from "@nestjs/common"
import {ConfigModule, ConfigService} from "@nestjs/config"
import {APP_GUARD} from "@nestjs/core"
import {JwtModule} from "@nestjs/jwt"
import {MongooseModule} from "@nestjs/mongoose"
import {ScheduleModule} from "@nestjs/schedule"
import {AuthGuard} from "src/auth/auth.guard"
import config from "src/config"
import {AppController} from "src/app.controller"
import {AppService} from "src/app.service"
import {AuthModule} from "src/auth/auth.module"
import {PaymentModule} from "src/payment/payment.module"
import {ResumeModule} from "src/resume/resume.module"
import {UsersModule} from "src/users/users.module"
import {StorageModule} from "./storage/storage.module"
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.local"],
      load: [config]
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get("db.host")
      })
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("jwtSecret"),
        signOptions: {
          expiresIn: "30d"
        }
      })
    }),
    AuthModule,
    UsersModule,
    ResumeModule,
    PaymentModule,
    StorageModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    AppService
  ]
})

export class AppModule {}
