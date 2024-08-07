import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req
} from "@nestjs/common"
import {Public} from "src/auth/auth.decorators"
import {UserFromToken} from "src/auth/auth.service"
import {PaymentService} from "./payment.service"

@Controller("payment")
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService
  ) {}

  @Public()
  @Get("pricing")
  async getPricing(
    @Req() req: {user?: UserFromToken},
    @Query() query: {
      country: string
    }
) {
    return this.paymentService.getPricing(req.user?._id, query.country)
  }

  @Post("intent")
  async createPaymentIntent(
    @Req() req: {user: UserFromToken}
  ) {
    return this.paymentService.createIntent(req.user._id)
  }

  @Post("subscription")
  async buySubscription(
    @Req() req: Request & {user: UserFromToken},
    @Body() body?: {setupIntentId?: string}
  ) {
    return this.paymentService.buySubscription(req.user._id, body.setupIntentId)
  }

  @Delete("subscription")
  async cancelSubscription(
    @Req() req: Request & {user: UserFromToken},
  ) {
    return this.paymentService.cancelSubscription(req.user._id)
  }
}
