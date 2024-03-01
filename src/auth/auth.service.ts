import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from "@nestjs/common"
import {JwtService} from "@nestjs/jwt"
import * as crypto from "crypto"
import {omit} from "lodash"
import {EmailService} from "src/email/email.service"
import {PaymentService} from "src/payment/payment.service"
import {User, UserDocument, UserObject} from "src/users/users.schema"
import {UsersService} from "src/users/users.service"
import * as bcrypt from "bcrypt"

export type UserFromToken = {
  _id: string
  email: string
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private paymentService: PaymentService
  ) {}

  async validateUser(
    email: string,
    password: string
  ): Promise<any> {
    const user = await this.usersService.findOne({email}, {
      pickPassword: true
    })

    if (!user) {
      throw new UnauthorizedException("Invalid email or password")
    }

    const passwordValid = await bcrypt.compare(password, user.password || "")

    if (!passwordValid) {
      throw new UnauthorizedException("Invalid email or password")
    }

    return omit(user, ["password"])
  }

  async signup(input: Pick<UserDocument, "email" | "password">) {
    if (!input.email || !input.password) {
      throw new BadRequestException("Invalid email or password")
    }

    const hashedPassword = await bcrypt.hash(input.password, 10)

    const user = await this.usersService.create({
      email: input.email,
      password: hashedPassword
    })

    return {
      accessToken: this.jwtService.sign({
        _id: user._id,
        email: user.email
      })
    }
  }

  async login(user: UserObject) {
    return {
      accessToken: this.jwtService.sign({
        _id: user._id,
        email: user.email
      }),
      ...user
    }
  }

  async loginGoogle(userData: {
    email: User["email"]
  } & Partial<User>) {
    try {
      let user = await this.usersService.findOne({
        email: userData.email
      })

      if (!user) {
        user = await this.usersService.create({
          ...userData,
          emailVerification: {
            isVerified: true,
            token: null,
            tokenDateCreated: null
          }
        })
      }

      return {
        accessToken: this.jwtService.sign({
          _id: user._id,
          email: user.email
        }),
        ...user
      }
    } catch (err) {
      throw new InternalServerErrorException("Something went wrong")
    }
  }

  async getProfile(userId: string) {
    if (!userId) {
      throw new UnauthorizedException("Unable to find user")
    }

    const user = await this.usersService.findOne({userId}, {
      pickSubscriptionData: true
    })
    let subscription: Partial<typeof user.subscription> = user.subscription

    if (user.subscription.subscriptionId && user.subscription.isActive) {
      subscription = {
        isActive: await this.paymentService.checkSubscription(subscription.subscriptionId)
      }
    }

    return {
      ...user,
      subscription: {
        isActive: subscription.isActive
      }
    }
  }

  async updateProfile(
    userId: string,
    input?: Partial<User & {
      newPassword: string
    }>,
    avatar?: Express.Multer.File
  ) {
    return await this.usersService.updateProfile(userId, input, avatar)
  }

  async createEmailVerification(email: UserObject["email"]) {
    const tokenData = {
      token: crypto.randomBytes(64).toString("hex"),
      tokenDateCreated: new Date()
    }

    // await this.emailService.sendVerificationEmail(email, tokenData.token)

    return tokenData
  }

  async resendVerificationEmail(userId: string) {
    const user = await this.usersService.findOne({userId}, {
      pickEmailVerificationData: true
    })

    if (user.emailVerification.tokenDateCreated) {
      const prevDate = new Date(user.emailVerification.tokenDateCreated).getTime()
      const currentDate = new Date().getTime()

      if (Math.floor((currentDate - prevDate) / 1000) < 60) {
        throw new BadRequestException("Verification email has been already sent")
      }
    }

    const data = await this.createEmailVerification(user.email)

    await this.usersService.updateOne(userId, {
      "$set": {
        "emailVerification.token": data.token,
        "emailVerification.tokenDateCreated": data.tokenDateCreated
      }
    })

    return {
      success: true
    }
  }

  async verifyEmail(token: string) {
    try {
      if (!token) {
        throw new UnauthorizedException("Invalid email or token")
      }

      const user = await this.usersService.findOne({
        emailVerificationToken: token
      })

      if (!user) {
        throw new UnauthorizedException("Invalid email or token")
      } else {
        await this.usersService.updateOne(user._id.toString(), {
          "$set": {
            "emailVerification": {
              "isVerified": true,
              "token": null,
              "tokenDateCreated": null
            }
          }
        })

        return {
          success: true
        }
      }
    } catch {
      throw new UnauthorizedException("Invalid email or token")
    }
  }
}
