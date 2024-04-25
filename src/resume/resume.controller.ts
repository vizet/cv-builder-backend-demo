import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  Res,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common"
import {FileInterceptor} from "@nestjs/platform-express"
import {HttpService} from "@nestjs/axios"
import {Response} from "express"
import {Stream} from "stream"
import {UserFromToken} from "src/auth/auth.service"
import {Public} from "src/auth/auth.decorators"
import {Resume} from "src/resume/resume.schema"
import {ResumeService} from "./resume.service"

@Controller("resume")
export class ResumeController {
  constructor(
    private readonly resumeService: ResumeService,
    private readonly httpService: HttpService,
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
  @UseInterceptors(FileInterceptor("avatar"))
  async updateById(
    @Request() req: {user: UserFromToken},
    @Param("id") id: string,
    @Body() body: Omit<Parameters<typeof this.resumeService.create>[0] & Pick<Resume, "preview">, "author">,
    @UploadedFile() avatar: Express.Multer.File
  ) {
    return this.resumeService.updateById(id, {
      title: body.title,
      preview: body.preview,
      author: req.user._id,
      data: body.data
    }, avatar)
  }

  @Delete(":id")
  async deleteById(
    @Request() req: {user: UserFromToken},
    @Param("id") id: string
  ) {
    return this.resumeService.deleteById(id, req.user._id)
  }

  @Public()
  @Get(":id/avatar")
  async getAvatar(
    @Param("id") id: string,
    @Res() response: Response
  ){
    const resume = await this.resumeService.findById(id)
    if (resume.data.sections.profile.avatar && resume.data.sections.profile.avatar.length > 0) {
      const res = await this.httpService.axiosRef<Stream>({
        url: resume.data.sections.profile.avatar,
        method: "GET",
        responseType: "stream"
      })
  
      return res.data.pipe(response)
    }

    return response.status(404).send()
  }
}
