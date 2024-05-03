import {forwardRef, Module} from "@nestjs/common"
import {UsersModule} from "src/users/users.module"
import {EmailModule} from "src/email/email.module"
import {PaymentController} from "./payment.controller"
import {PaymentService} from "./payment.service"

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => EmailModule)
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService]
})

export class PaymentModule {}
