import {Module} from "@nestjs/common"
import {MongooseModule} from "@nestjs/mongoose"
import {ResumeController} from "./resume.controller"
import {ResumeService} from "./resume.service"
import {Resume, ResumeSchema} from "./resume.schema"
import {HttpModule} from "@nestjs/axios"
import {StorageModule} from "src/storage/storage.module"
import {StorageService} from "src/storage/storage.service"

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Resume.name,
      schema: ResumeSchema
    }]),
    StorageModule,
    HttpModule
  ],
  providers: [ResumeService, StorageService],
  controllers: [ResumeController],
  exports: [ResumeService]
})

export class ResumeModule {}
