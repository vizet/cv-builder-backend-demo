import {forwardRef, Module} from "@nestjs/common"
import {MongooseModule} from "@nestjs/mongoose"
import {AuthModule} from "src/auth/auth.module"
import {PaymentModule} from "src/payment/payment.module"
import {UsersService} from "./users.service"
import {User, UsersSchema} from "./users.schema"
import {StorageModule} from "src/storage/storage.module"
import {EmailService} from "src/email/email.service"

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: User.name,
      schema: UsersSchema
    }]),
    forwardRef(() => AuthModule),
    forwardRef(() => PaymentModule),
    StorageModule
  ],
  providers: [UsersService, EmailService],
  exports: [UsersService, EmailService]
})

export class UsersModule {}
