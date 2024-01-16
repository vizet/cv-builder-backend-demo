import {BadRequestException, Injectable, UnauthorizedException} from "@nestjs/common"
import {JwtService} from "@nestjs/jwt"
import {UserDocument} from "src/users/users.schema"
import {UsersService} from "src/users/users.service"
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    email: string,
    password: string
  ): Promise<any> {
    const user = await this.usersService.findOne(email, {
      pickPassword: true
    })

    if (!user) {
      throw new UnauthorizedException("Invalid email or password")
    }

    const passwordValid = await bcrypt.compare(password, user.password)

    if (!passwordValid) {
      throw new UnauthorizedException("Invalid email or password")
    }

    const {
      password: pass,
      ...result
    } = user

    return result
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

  async login(user: UserDocument) {
    return {
      accessToken: this.jwtService.sign({
        _id: user._id,
        email: user.email
      }),
      ...user
    }
  }

  async getProfile(userFromToken: Pick<UserDocument, "_id" | "email">) {
    if (!userFromToken.email) {
      throw new UnauthorizedException()
    }

    const user = await this.usersService.findOne(userFromToken.email)

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
