import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request
} from "@nestjs/common"
import {UserFromToken} from "src/auth/auth.service"
import {PaymentService} from "./payment.service"

@Controller("payment")
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService
  ) {}

  @Post("intent")
  async createPaymentIntent(
    @Request() req: {user: UserFromToken}
  ) {
    return this.paymentService.createIntent(req.user._id)
  }

  @Get("methods")
  async getMethods(
    @Request() req: {user: UserFromToken}
  ) {
    return this.paymentService.getMethods(req.user._id)
  }

  @Delete("methods/:id")
  async deleteMethod(
    @Param("id") id: string
  ) {
    return this.paymentService.deleteMethod(id)
  }

  @Put("methods/:id/set-default")
  async setMethodDefault(
    @Request() req: {user: UserFromToken},
    @Param("id") id: string
  ) {
    return this.paymentService.setDefaultMethod(req.user._id, id)
  }

  @Post("subscription")
  async buySubscription(
    @Request() req: {user: UserFromToken},
    @Body() body: Parameters<typeof this.paymentService.buySubscription>[1]
  ) {
    return this.paymentService.buySubscription(req.user._id, body)
  }

  @Delete("subscription")
  async cancelSubscription(
    @Request() req: {user: UserFromToken},
  ) {
    return this.paymentService.cancelSubscription(req.user._id)
  }
}
