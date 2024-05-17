import {ConfigService} from "@nestjs/config"
import {Injectable} from "@nestjs/common"
import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client
} from "@aws-sdk/client-s3"
import {randomBytes} from "crypto"

@Injectable()
export class StorageService {
  constructor(
    private configService: ConfigService
  ) {}

  private BUCKET = this.configService.get("awsS3Storage.awsS3Bucket") || ""

  private s3Client = new S3Client({
    credentials: {
      accessKeyId: this.configService.get("awsS3Storage.awsAccessKeyId") || "",
      secretAccessKey: this.configService.get("awsS3Storage.awsAccessKeySecret") || ""
    },
    region: "eu-north-1"
  })

  private randomaseImageName(bytes = 32) {
    return randomBytes(bytes).toString("hex")
  }

  private async s3_upload(
    file: Buffer,
    bucket: string,
    name: string,
    mimetype: string,
  ) {
    const params: PutObjectCommandInput = {
      Bucket: bucket,
      Key: name,
      Body: file,
      ContentType: mimetype,
      ACL: "public-read-write"
    }

    const command = new PutObjectCommand(params)

    try {
      const s3Response = await this.s3Client.send(command)

      return {...s3Response, imageName: params.Key}
    } catch (e) {
      console.log(e)
    }
  }

  private async s3_delete(
    fileName: string,
  ) {
    const params: DeleteObjectCommandInput = {
      Bucket: this.BUCKET,
      Key: fileName
    }

    const command = new DeleteObjectCommand(params)

    try {
      const s3Response = await this.s3Client.send(command)

      return {...s3Response, imageName: params.Key}
    } catch (e) {
      console.log(e)
    }
  }

  async uploadFile(file: Express.Multer.File, folderName?: string) {
    const fileName = folderName
      ? `${folderName}/${this.randomaseImageName()}`
      : this.randomaseImageName()

    return await this.s3_upload(
      file.buffer,
      this.BUCKET,
      fileName,
      file.mimetype,
    )
  }

  async uploadReplaceFile(file: Express.Multer.File, fileName: string) {
    return await this.s3_upload(
      file.buffer,
      this.BUCKET,
      fileName,
      file.mimetype,
    )
  }

  async deleteFile(fileName: string) {
    return await this.s3_delete(fileName)
  }
}
