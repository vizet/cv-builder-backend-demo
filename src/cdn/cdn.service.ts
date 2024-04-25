import {BadRequestException, Injectable} from "@nestjs/common"
import {ConfigService} from "@nestjs/config"
import axios from "axios"

@Injectable()
export class CDNService {
  constructor(
    private configService: ConfigService
  ) {}

  private instance = axios.create({
    baseURL: `${this.configService.get("cloudflare.url")}/${this.configService.get("cloudflare.accountId")}/images/v1`,
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${this.configService.get("cloudflare.apiToken")}`
    }
  })

  async uploadImage(file: Express.Multer.File) {
    const fileSize = parseFloat(((file.size/1024)/1024).toFixed(4))

    if (fileSize > 10) {
      throw new BadRequestException("The maximum file size is 10 MB")
    }

    const formData = new FormData()

    formData.append("file", new Blob([file.buffer]))

    const res = await this.instance.post<{
      success: boolean
      result: {
        filename: string
        id: string
        requireSignedURLs: boolean
        uploaded: string
        variants: string[]
      }
    } | null>("", formData).catch(err => {
      return {
        data: null,
        error: {
          status: err.response.status,
          statusText: err.response.statusText
        }
      }
    })

    if ("error" in res && res.error) {
      throw new BadRequestException(res.error.statusText)
    } else {
      const url = res.data?.result?.variants?.[0]

      if (url) {
        return url as string
      } else {
        throw new BadRequestException()
      }
    }
  }

  async deleteImage(url: string) {
    const id = url.split("/")[4]

    if (id) {
      await this.instance.delete(id).catch(err => {
        return {
          data: null,
          error: {
            status: err.response.status,
            statusText: err.response.statusText
          }
        }
      })
    }
  }
}
