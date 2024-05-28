import {
  BadRequestException,
  Injectable, NotFoundException, UnauthorizedException
} from "@nestjs/common"
import {InjectModel} from "@nestjs/mongoose"
import {Model} from "mongoose"
import {Resume} from "src/resume/resume.schema"
import {StorageService} from "src/storage/storage.service"

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(Resume.name) private resumeModel: Model<Resume>,
    private storage: StorageService,
  ) {}

  async create(
    input: {
      title: Resume["title"]
      preview?: Resume["preview"]
      author: string
      data: Partial<Resume["data"]>
    }
  ) {
    try {
      const newResume = await new this.resumeModel({
        title: input.title,
        preview: input.preview,
        author: input.author,
        data: input.data
      }).save()

      return newResume.toObject()
    } catch (err) {
      throw new BadRequestException("Something went wrong")
    }
  }

  async findByUser(
    userId: string
  ) {
    const result = await this.resumeModel.find({
      "author": userId
    }).sort({
      "dateUpdated": -1
    })

    return result || null
  }

  async findById(
    id: string,
    userId?: string
  ) {
    try {
      const query = {
        "_id": id
      }

      if (userId) {
        query["author"] = userId
      }

      const result = await this.resumeModel.findOne(query)

      return result?.toObject() || null
    } catch (err) {
      throw new NotFoundException()
    }
  }

  async updateById(
    id: string,
    input: {
      author: string
      title?: Resume["title"]
      preview?: Resume["preview"]
      data?: Partial<Resume["data"]>
    },
    avatar: Express.Multer.File
  ) {
    try {
      const resume = await this.resumeModel.findOne({
        "_id": id,
        "author": input.author
      })

      if (!resume) {
        throw new UnauthorizedException()
      }

      if (typeof input.title === "string") {
        resume.title = input.title
      }

      if (input.preview) {
        resume.preview = input.preview
      }

      if (input.data) {
        resume.data = {
          ...resume.data,
          ...input.data
        }
      }

      if (avatar) {
        if (resume.data.sections.profile.avatar && typeof resume.data.sections.profile.avatar === "string") {
          await this.storage.deleteFile(resume.data.sections.profile.avatar)
        }

        const imgRes = await this.storage.uploadFile(avatar, "resume_avatars")

        if (imgRes) {
          resume.data.sections.profile.avatar = imgRes.imageName
          resume.markModified("data")
        }
      }

      const updatedResume = await resume.save()

      return updatedResume.toObject()
    } catch (err) {
      throw new BadRequestException("Something went wrong")
    }
  }

  async deleteById(
    id: string,
    userId?: string
  ) {
    try {
      const query = {
        "_id": id
      }

      if (userId) {
        query["author"] = userId
      }

      await this.resumeModel.deleteOne(query)

      return null
    } catch (err) {
      throw new BadRequestException("Something went wrong")
    }
  }
}
