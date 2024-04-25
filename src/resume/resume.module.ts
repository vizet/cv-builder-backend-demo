import {Module} from "@nestjs/common"
import {MongooseModule} from "@nestjs/mongoose"
import {ResumeController} from "./resume.controller"
import {ResumeService} from "./resume.service"
import {Resume, ResumeSchema} from "./resume.schema"
import {CDNService} from "src/cdn/cdn.service"
import {CDNModule} from "src/cdn/cdn.module"
import {HttpModule} from "@nestjs/axios"

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Resume.name,
      schema: ResumeSchema
    }]),
    CDNModule,
    HttpModule
  ],
  providers: [ResumeService, CDNService],
  controllers: [ResumeController],
  exports: [ResumeService]
})

export class ResumeModule {}
