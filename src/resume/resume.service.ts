import {
  BadRequestException,
  Injectable, NotFoundException, UnauthorizedException
} from "@nestjs/common"
import {InjectModel} from "@nestjs/mongoose"
import {Model} from "mongoose"
import {Resume} from "src/resume/resume.schema"

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(Resume.name) private resumeModel: Model<Resume>
  ) {}

  async create(
    input: {
      title: Resume["title"]
      author: string
      data: Partial<Resume["data"]>
    }
  ) {
    try {
      const newResume = await new this.resumeModel({
        title: input.title,
        preview: "",
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
    }
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
