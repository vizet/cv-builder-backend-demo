import {ConfigService} from "@nestjs/config"
import OpenAI from "openai"

export class OpenAIService {
  constructor(private configService: ConfigService) {}

  private openAiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || ""
  })

  async getAnswerCore(language: string, userContent: string) {
    const chatCompletion = await this.openAiClient.chat.completions.create({
      messages: [
        {
          role: "assistant",
          content: `You are an assistant who helps to create a cv resume on ${language} language. You can return answers in JSON format like '{ answer: <your answer here>}'`
        },
        {
          role: "user",
          content: userContent
        }
      ],
      model: "gpt-4o-mini",
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "answer_schema",
          strict: true,
          schema: {
            type: "object",
            properties: {
              answer: {
                description: "Answer for request",
                type: "string"
              }
            },
            additionalProperties: false,
            required: ["answer"]
          }
        }
      }
    })

    return chatCompletion
  }

  async generateWorkExperienceSummaryText(
    language: string,
    data: { company: string, workingTime: string, position: string }
  ) {
    const userContent = `I worked at company ${data.company} for ${data.workingTime} days as a ${data.position}. Write a short text about work experience in this company. Convert days to year without days`
    const chatCompletion = await this.getAnswerCore(language, userContent)

    return {
      data: JSON.parse(chatCompletion.choices[0].message.content || "{}")
    }
  }

  async generateEducationSummaryText(
    language: string,
    data: { institute: string, degree: string, location: string }
  ) {
    const userContent = `I studied at the ${data.institute} institute for the degree of ${data.degree} in ${data.location}. Write a short text about my education experience in this institute`
    const chatCompletion = await this.getAnswerCore(language, userContent)

    return {
      data: JSON.parse(chatCompletion.choices[0].message.content || "{}")
    }
  }
}
