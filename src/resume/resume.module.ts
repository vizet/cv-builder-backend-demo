import {Module} from "@nestjs/common"
import {MongooseModule} from "@nestjs/mongoose"
import {ResumeController} from "./resume.controller"
import {ResumeService} from "./resume.service"
import {Resume, ResumeSchema} from "./resume.schema"

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Resume.name,
      schema: ResumeSchema
    }])
  ],
  providers: [ResumeService],
  controllers: [ResumeController],
  exports: [ResumeService]
})

export class ResumeModule {}
