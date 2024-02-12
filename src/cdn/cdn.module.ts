import {Module} from "@nestjs/common"
import {CDNService} from "./cdn.service"

@Module({
  providers: [CDNService],
  exports: [CDNService]
})

export class CDNModule {}
