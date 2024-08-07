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
import * as countriesPriceData from "../payment/countriesPriceData.json"

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

  async signup(input: Pick<UserDocument, "email" | "password" | "country">) {
    if (!input.email || !input.password) {
      throw new BadRequestException("Invalid email or password")
    }

    const hashedPassword = await bcrypt.hash(input.password, 10)

    const user = await this.usersService.create({
      email: input.email,
      password: hashedPassword,
      country: input.country
    })

    this.emailService.sendSignUpWithGoogleSuccessfulEmail({name: user.fullName, email: user.email}, input.country)

    return {
      accessToken: this.jwtService.sign({
        _id: user._id,
        email: user.email
      }),
      id: user._id,
      email: user.email
    }
  }

  async signupWithoutPassword(input: Pick<UserDocument, "email" | "firstName" | "lastName" | "country">) {
    if (!input.email || !input.firstName || !input.lastName) {
      throw new BadRequestException("Invalid email, first name or last name")
    }

    const salt = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(salt, 10)

    const user = await this.usersService.create({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      password: hashedPassword,
      country: input.country
    })

    await this.emailService.sendSignUpWithEmailSuccessfulEmail({email: user.email, name: user.fullName, generated_password: salt}, input.country)

    return {
      accessToken: this.jwtService.sign({
        _id: user._id,
        email: user.email
      }),
      generatedPassword: salt
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

        if (user) {
          this.emailService.sendSignUpWithGoogleSuccessfulEmail({name: user.fullName, email: user.email}, user.country)
        }
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
    const subscription: Partial<typeof user.subscription> = await this.paymentService.checkSubscription(
      userId,
      user.subscription
    )

    return {
      ...user,
      subscription
    }
  }

  async getProfileByEmail(email: string) {
    if (!email) {
      throw new BadRequestException("Unable to find user")
    }

    const user = await this.usersService.findOne({email}, {
      pickSubscriptionData: true
    })

    if (!user) {
      throw new BadRequestException("Unable to find user")
    }
    const subscription: Partial<typeof user.subscription> = await this.paymentService.checkSubscription(
      user._id.toString(),
      user.subscription
    )

    return {
      ...user,
      subscription
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

  async recoveryPasswordEmail(email: string){
    try {
      const user = await this.usersService.findOne({email})

      if (!user) {
        throw new UnauthorizedException("Cannot sent recovery email")
      } else {
        const token = this.jwtService.sign({userId: user._id})

        await this.emailService.sendRecoveryPasswordEmail({email: user.email, name: user.fullName, token}, user.country)

        return {
          success: true
        }
      }
    } catch (error) {
      throw new UnauthorizedException("Cannot sent recovery email")
    }
  }

  async recoveryPasswordEmailResetPassword(token: string, password: string){
    try {
      const tokenData = this.jwtService.verify(token)

      if (!tokenData.userId) {
        throw new UnauthorizedException("Cannot reset password")
      } else {
        const user = await this.usersService.findOne({userId: tokenData.userId})

        if (!user) {
          throw new UnauthorizedException("Cannot reset password")
        } else {
          const updatedUser = await this.usersService.updateProfile(tokenData.userId, {newResetPassword: password})

          if (!updatedUser) {
            throw new UnauthorizedException("Cannot reset password")
          } else {
            await this.emailService.sendRecoveryPasswordSuccessfulEmail({email: user.email, name: user.fullName}, user.country)
          }

          return {
            success: true
          }
        }
      }

    } catch (error) {
      throw new UnauthorizedException("Cannot reset password")
    }
  }
}
