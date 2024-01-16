import {Injectable} from "@nestjs/common"

@Injectable()
export class AppService {
  healthCheck(): string {
    return "CV Builder API status is OK"
  }
}
