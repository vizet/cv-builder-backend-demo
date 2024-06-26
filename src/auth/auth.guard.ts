import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common"
import {Reflector} from "@nestjs/core"
import {JwtService} from "@nestjs/jwt"
import {AuthGuard as PassportAuthGuard} from "@nestjs/passport"
import axios from "axios"
import {ExtractJwt} from "passport-jwt"
import {IS_PUBLIC_KEY} from "./auth.decorators"

@Injectable()
export class LocalAuthGuard extends PassportAuthGuard(["local"]) {}

@Injectable()
export class AuthGuard extends PassportAuthGuard(["jwt"]) {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService
  ) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    const req = context.switchToHttp().getRequest()
    const extractToken = ExtractJwt.fromAuthHeaderAsBearerToken()
    const token = extractToken(req)

    if (token) {
      const user = this.jwtService.verify(token)

      if (user) {
        req.user = user
      }
    }

    if (isPublic) {
      return true
    }

    return super.canActivate(context)
  }
}

@Injectable()
export class GoogleAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()
    const accessToken = req.headers["authorization"]

    if (!accessToken) {
      throw new UnauthorizedException("Invalid Google access token")
    }

    try {
      const {data} = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
      )

      if (!data?.email) {
        return false
      }

      req["user"] = {
        email: data.email.toLowerCase(),
        avatar: data.picture,
        firstName: data.given_name,
        lastName: data.family_name
      }

      return true
    } catch (err) {
      throw new UnauthorizedException("Invalid Credentials")
    }
  }
}
