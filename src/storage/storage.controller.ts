import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Put,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common"
import {Public} from "src/auth/auth.decorators"
import {StorageService} from "./storage.service"
import {FileInterceptor} from "@nestjs/platform-express"

@Controller("storage")
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Public()
  @Put("upload-unauth-avatar")
  @UseInterceptors(FileInterceptor("avatar"))
  async uploadUnauthAvatar(
    @Body() body: { prevAvatarImageName?: string },
    @UploadedFile() avatar: Express.Multer.File
  ) {
    try {
      if (body?.prevAvatarImageName) {
        await this.storageService.deleteFile(body.prevAvatarImageName)
      }

      const imgRes = await this.storageService.uploadFile(avatar, "resume_avatars")

      if (imgRes) {
        return {
          avatarImageName: imgRes.imageName
        }
      }

      return null
    } catch (error) {
      throw new BadRequestException("Something went wrong")
    }
  }

  @Public()
  @Delete("delete-unauth-avatar")
  @UseInterceptors(FileInterceptor("avatar"))
  async deleteUnauthAvatar(@Body() body: { avatarImageName: string }) {
    try {
      if (body.avatarImageName) {
        await this.storageService.deleteFile(body.avatarImageName)
      }
    } catch (error) {
      throw new BadRequestException("Something went wrong")
    }
  }
}
