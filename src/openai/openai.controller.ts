import {OpenAIService} from "./openai.service"
import {Body, Controller, Get, Post} from "@nestjs/common"
import {Public} from "src/auth/auth.decorators"

export type TSection = "workExperience" | "education"

@Controller()
export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService) {}

  @Public()
  @Post("ai/generateSummaryText")
  test(
    // @Body() body: Parameters<typeof this.openAIService.generateSummaryText>[0]
    @Body()
    body: {
      section: TSection
      language: string
      data: Record<string, any>
    }
  ) {
    switch (body.section) {
      case "workExperience":
        return this.openAIService.generateWorkExperienceSummaryText(
          body.language,
          body.data as Parameters<
            typeof this.openAIService.generateWorkExperienceSummaryText
          >[1]
        )

      case "education":
        return this.openAIService.generateEducationSummaryText(
          body.language,
          body.data as Parameters<
            typeof this.openAIService.generateEducationSummaryText
          >[1]
        )

      default:
        break
    }
  }
}
