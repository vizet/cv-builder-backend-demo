import {
  BadRequestException,
  ConflictException,
  Injectable, UnauthorizedException
} from "@nestjs/common"
import {InjectModel} from "@nestjs/mongoose"
import {Model} from "mongoose"
import {User} from "./users.schema"
import * as bcrypt from "bcrypt"

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async create(
    input: {
      email: User["email"]
    } & Partial<User>
  ) {
    try {
      const newUser = await new this.userModel({
        email: input.email,
        emailVerified: input.emailVerified,
        password: input.password,
        avatar: input.avatar,
        firstName: input.firstName,
        lastName: input.lastName
      }).save()

      return newUser.toObject()
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException("User already exists")
      } else {
        throw new BadRequestException("Something went wrong")
      }
    }
  }

  async findById(
    userId: string,
    options?: {
      pickPassword?: boolean
    }
  ) {
    const result = await this.userModel.findOne({
      "_id": userId
    }).select(!options?.pickPassword ? ["-password"] : [])

    return result?.toObject() || null
  }

  async findByEmail(
    email: string,
    options?: {
      pickPassword?: boolean
    }
  ) {
    const result = await this.userModel.findOne({
      "email": email
    }).select(!options?.pickPassword ? ["-password"] : [])

    return result?.toObject() || null
  }

  async updateOne(
    userId: string,
    input: Partial<User & {
      newPassword: string
    }>
  ) {
    const user = await this.userModel.findOne({
      "_id": userId
    })

    if (!user) {
      throw new UnauthorizedException("Unable to find user")
    }

    if ("email" in input && input.email !== user.email) {
      user.email = input.email
      user.emailVerified = false
    }

    if ("newPassword" in input) {
      let acceptable = true

      if (!!user.password) {
        acceptable = await bcrypt.compare(input.newPassword, user.password)
      }

      if (!acceptable) {
        throw new UnauthorizedException("Invalid password")
      } else {
        user.password = await bcrypt.hash(input.newPassword, 10)
      }
    }

    user.firstName = "firstName" in input ? input.firstName : user.firstName
    user.lastName = "lastName" in input ? input.lastName : user.lastName
    user.avatar = "avatar" in input ? input.avatar : user.avatar

    try {
      await user.save()

      console.log(">>>", user.toObject())

      return user.toObject()
    } catch (err) {
      throw new BadRequestException("Something went wrong")
    }
  }
}
