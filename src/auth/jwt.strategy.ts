import {ConfigService} from "@nestjs/config"
import {ExtractJwt, Strategy} from "passport-jwt"
import {PassportStrategy} from "@nestjs/passport"
import {Injectable} from "@nestjs/common"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("jwtSecret")
    })
  }

  async validate(payload: any) {
    return {
      _id: payload._id,
      email: payload.email
    }
  }
}
