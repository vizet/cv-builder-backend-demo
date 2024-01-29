import {Module} from "@nestjs/common"
import {ConfigModule, ConfigService} from "@nestjs/config"
import {APP_GUARD} from "@nestjs/core"
import {MongooseModule} from "@nestjs/mongoose"
import {AuthGuard} from "src/auth/auth.guard"
import config from "src/config"
import {AppController} from "src/app.controller"
import {AppService} from "src/app.service"
import {AuthModule} from "src/auth/auth.module"
import {ResumeModule} from "src/resume/resume.module"
import {UsersModule} from "src/users/users.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.local"],
      load: [config]
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get("db.host")
      })
    }),
    AuthModule,
    UsersModule,
    ResumeModule
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
