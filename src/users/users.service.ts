import {
  BadRequestException,
  ConflictException,
  Injectable
} from "@nestjs/common"
import {InjectModel} from "@nestjs/mongoose"
import {Model} from "mongoose"
import {User} from "./users.schema"

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

  async findOne(
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
}
