import {forwardRef, Module} from "@nestjs/common"
import {UsersModule} from "src/users/users.module"
import {PaymentController} from "./payment.controller"
import {PaymentService} from "./payment.service"

@Module({
  imports: [
    forwardRef(() => UsersModule)
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService]
})

export class PaymentModule {}
