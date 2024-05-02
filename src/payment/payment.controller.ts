import {
  Body,
  Controller,
  Delete, Get,
  Post,
  Request
} from "@nestjs/common"
import {UserFromToken} from "src/auth/auth.service"
import {PaymentService} from "./payment.service"

@Controller("payment")
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService
  ) {}

  @Get("pricing")
  async getPricing(
    @Request() req: {user: UserFromToken}
  ) {
    return this.paymentService.getPricing(req.user._id)
  }

  @Post("intent")
  async createPaymentIntent(
    @Request() req: {user: UserFromToken}
  ) {
    return this.paymentService.createIntent(req.user._id)
  }

  @Post("subscription")
  async buySubscription(
    @Request() req: {user: UserFromToken}
  ) {
    return this.paymentService.buySubscription(req.user._id)
  }

  @Delete("subscription")
  async cancelSubscription(
    @Request() req: {user: UserFromToken},
  ) {
    return this.paymentService.cancelSubscription(req.user._id)
  }
}
