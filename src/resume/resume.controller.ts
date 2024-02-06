import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Post,
  Put,
  Request
} from "@nestjs/common"
import {UserFromToken} from "src/auth/auth.service"
import {Resume} from "src/resume/resume.schema"
import {ResumeService} from "./resume.service"

@Controller("resume")
export class ResumeController {
  constructor(
    private readonly resumeService: ResumeService
  ) {}

  @Post()
  async createNew(
    @Request() req: {user: UserFromToken},
    @Body() body: Omit<Parameters<typeof this.resumeService.create>[0], "author">
  ) {
    return this.resumeService.create({
      title: body.title,
      preview: body.preview,
      author: req.user._id,
      data: body.data
    })
  }

  @Get("my")
  async getMy(
    @Request() req: {user: UserFromToken}
  ) {
    return this.resumeService.findByUser(req.user._id)
  }

  @Get(":id")
  async getById(
    @Request() req: {user: UserFromToken},
    @Param("id") id: string
  ) {
    return this.resumeService.findById(id, req.user._id)
  }

  @Put(":id")
  async updateById(
    @Request() req: {user: UserFromToken},
    @Param("id") id: string,
    @Body() body: Omit<Parameters<typeof this.resumeService.create>[0] & Pick<Resume, "preview">, "author">
  ) {
    return this.resumeService.updateById(id, {
      title: body.title,
      preview: body.preview,
      author: req.user._id,
      data: body.data
    })
  }

  @Delete(":id")
  async deleteById(
    @Request() req: {user: UserFromToken},
    @Param("id") id: string
  ) {
    return this.resumeService.deleteById(id, req.user._id)
  }
}
