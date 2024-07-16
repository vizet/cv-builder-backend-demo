import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException
} from "@nestjs/common"
import {InjectModel} from "@nestjs/mongoose"
import {Cron, CronExpression, SchedulerRegistry} from "@nestjs/schedule"
import {omit} from "lodash"
import {Model} from "mongoose"
import {AuthService} from "src/auth/auth.service"
import {StorageService} from "src/storage/storage.service"
import {EmailService} from "src/email/email.service"
import {User, UserDocument, UserObject} from "./users.schema"
import * as bcrypt from "bcrypt"

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(forwardRef(() => AuthService))
    private auth: AuthService,
    private storage: StorageService,
    private email: EmailService,
    private scheduler: SchedulerRegistry,
  ) {}

  @Cron("0 0 */5 * * *")
  async sendReminder1st() {
    try {
      const users = await this.userModel.find({"subscription.isActive": false})

      const promises = []
      for (const user of users) {
        promises.push(this.email.sendReminder1stEmail({email: user.email, name: user.fullName}))
      }

      Promise.all(promises)
    } catch (err) {
      console.error(err)
    }
  }
  async create(
    input: {
      email: User["email"]
    } & Partial<User>
  ) {
    try {
      const getEmailVerification = async () => {
        if (input.emailVerification) {
          return input.emailVerification
        } else {
          const verificationData = await this.auth.createEmailVerification(input.email)

          return {
            isVerified: false,
            ...verificationData
          }
        }
      }

      const newUser = await new this.userModel({
        email: input.email,
        emailVerification: await getEmailVerification(),
        password: input.password,
        avatar: input.avatar,
        firstName: input.firstName,
        lastName: input.lastName
      }).save()

      return omit(newUser.toObject(), [
        "emailVerification.token",
        "emailVerification.tokenDateCreated",
        "password"
      ]) as UserObject
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException("User already exists")
      } else {
        throw new BadRequestException("Something went wrong")
      }
    }
  }

  async findOne<O extends boolean = true>(
    input: {
      userId: string | UserObject["_id"]
    } | {
      email: string
    } | {
      emailVerificationToken: string
    },
    options?: {
      pickPassword?: boolean
      pickEmailVerificationData?: boolean
      pickCustomerId?: boolean
      pickSubscriptionData?: boolean
      object?: O
    }
  ): Promise<O extends true ? UserObject : UserDocument> {
    const pickPrivateFields = []

    if (options?.pickPassword) {
      pickPrivateFields.push("+password")
    }

    if (options?.pickEmailVerificationData) {
      pickPrivateFields.push(
        "+emailVerification.token",
        "+emailVerification.tokenDateCreated"
      )
    }

    if (options?.pickCustomerId) {
      pickPrivateFields.push("+customerId")
    }

    if (options?.pickSubscriptionData) {
      pickPrivateFields.push("+subscription.subscriptionId")
      pickPrivateFields.push("+subscription.trialExpiryDate")
    }

    const query = "userId" in input ? {
      "_id": input.userId
    } : "email" in input ? {
      "email": input.email
    } : {
      "emailVerification.token": input.emailVerificationToken
    }

    const result = await this.userModel.findOne(query).select(pickPrivateFields)

    if (options?.object !== false) {
      return result?.toObject() || null
    } else {
      return result || null
    }
  }

  updateOne(
    userId: string,
    input: any
  ) {
    return this.userModel.updateOne({
      "_id": userId
    }, input)
  }

  async updateProfile(
    userId: string,
    input: Partial<User & {
      newPassword: string
      newResetPassword: string
    }>,
    locale: string,
    avatar?: Express.Multer.File
  ) {
    const user = await this.findOne({
      userId
    }, {
      pickPassword: true,
      pickEmailVerificationData: true,
      object: false
    })

    if (!user) {
      throw new UnauthorizedException("Unable to find user")
    }

    if ("country" in input && !user.country) {
      user.country = input.country
    }

    if ("email" in input && input.email !== user.email) {
      const verificationData = await this.auth.createEmailVerification(input.email)

      user.email = input.email
      user.emailVerification = {
        isVerified: false,
        ...verificationData
      }
    }

    if ("newPassword" in input) {
      let acceptable = true

      if (!!user.password) {
        acceptable = await bcrypt.compare(input.password, user.password)
      }

      if (!acceptable) {
        throw new UnauthorizedException("Invalid password")
      } else {
        user.password = await bcrypt.hash(input.newPassword, 10)

        await this.email.sendRecoveryPasswordSuccessfulEmail({
          email: user.email,
          name: user.fullName || user.firstName
        }, locale)
      }
    }

    if ("newResetPassword" in input) {
      const newHashedPassword = await bcrypt.hash(input.newResetPassword, 10)

      user.password = newHashedPassword
    }

    if (avatar) {
      if (user.avatar) {
        await this.storage.deleteFile(user.avatar)
      }

      const imgRes = await this.storage.uploadFile(avatar, "profile_avatars")
      imgRes?.imageName && (user.avatar = imgRes.imageName)
    } else if ("avatar" in input) {
      if (!input.avatar && user.avatar) {
        await this.storage.deleteFile(user.avatar)
      }

      user.avatar = input.avatar
    }

    user.firstName = "firstName" in input ? input.firstName : user.firstName
    user.lastName = "lastName" in input ? input.lastName : user.lastName

    try {
      await user.save()

      return omit(user.toObject(), [
        "emailVerification.token",
        "emailVerification.tokenDateCreated",
        "password"
      ])
    } catch (err) {
      throw new BadRequestException("Something went wrong")
    }
  }

  async updateSubscription(
    userId: string,
    input: Partial<User["subscription"]>
  ) {
    try {
      const user = await this.findOne({
        userId
      }, {
        object: false,
        pickSubscriptionData: true
      })

      if (!user) {
        throw new UnauthorizedException("Unable to find user")
      }

      user.subscription = {
        ...user.toObject().subscription,
        ...input
      }

      await user.save()

      return user.toObject()
    } catch (err) {
      throw new BadRequestException("Something went wrong")
    }
  }
}
