import {OpenAIService} from "./openai.service"
import {Body, Controller, Post} from "@nestjs/common"
import {Public} from "src/auth/auth.decorators"

export type TSection = "workExperience" | "education" | "course" | "achievement" | "certificate" | "extraActivitie" | "intership" | "customField"

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
      
      case "course":
        return this.openAIService.generateCourseSummaryText(
          body.language,
          body.data as Parameters<
            typeof this.openAIService.generateCourseSummaryText
          >[1]
        )
      
      case "achievement":
        return this.openAIService.generateAchievementSummaryText(
          body.language,
          body.data as Parameters<
            typeof this.openAIService.generateAchievementSummaryText
          >[1]
        )
      
      case "certificate":
        return this.openAIService.generateCertificateSummaryText(
          body.language,
          body.data as Parameters<
            typeof this.openAIService.generateCertificateSummaryText
          >[1]
        )
      
      case "extraActivitie":
        return this.openAIService.generateExtraActivitiesSummaryText(
          body.language,
          body.data as Parameters<
            typeof this.openAIService.generateExtraActivitiesSummaryText
          >[1]
        )
      
      case "intership":
        return this.openAIService.generateIntershipsSummaryText(
          body.language,
          body.data as Parameters<
            typeof this.openAIService.generateIntershipsSummaryText
          >[1]
        )
      
      case "customField":
        return this.openAIService.generateCustomFieldsSummaryText(
          body.language,
          body.data as Parameters<
            typeof this.openAIService.generateCustomFieldsSummaryText
          >[1]
        )

      default:
        break
    }
  }
}
