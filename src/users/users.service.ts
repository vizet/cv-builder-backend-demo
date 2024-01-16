import {BadRequestException, ConflictException, Injectable} from "@nestjs/common"
import {InjectModel} from "@nestjs/mongoose"
import {Model} from "mongoose"
import {User, UserDocument} from "./users.schema"

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async create(input: Pick<UserDocument, "email" | "password">): Promise<UserDocument | undefined> {
    try {
      return await new this.userModel({
        email: input.email,
        password: input.password
      }).save()
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
  ): Promise<User | null> {
    const result = await this.userModel.findOne({
      "email": email
    }).select(!options?.pickPassword ? ["-password"] : [])

    return result?.toObject() || null
  }
}
