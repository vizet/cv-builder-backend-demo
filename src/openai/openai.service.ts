import {ConfigService} from "@nestjs/config"
import OpenAI from "openai"

export class OpenAIService {
  constructor(private configService: ConfigService) {}

  private openAiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || ""
  })
  DEFAULT_MAX_CHARACTERS_IN_ANSWER = 400

  async getAnswerCore({language, maxCharacters, userContent}:{language: string, maxCharacters: number, userContent: string}) {
    const chatCompletion = await this.openAiClient.chat.completions.create({
      messages: [
        {
          role: "assistant",
          content: `You are an assistant who helps to create perfect a cv resume on ${language} language.
          It is advisable not to exceed ${maxCharacters} characters.
          You can return answers in JSON format like '{ answer: <your answer here>}'`
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
    data: { company?: string, workingTime?: number, position: string }
  ) {
    const enteredData: string[] = []

    if (data.company) {
      enteredData.push(`company name: ${data.company}`)
    }
    
    if (data.workingTime) {
      enteredData.push(`working time in days: ${data.workingTime}`)
    }

    const userContent = ` 
      Write a short text about my work experience, using the following information: i worked at position ${data.position}, ${enteredData.join(", ")}.
      Convert days to year without days`
    const chatCompletion = await this.getAnswerCore({language, maxCharacters: this.DEFAULT_MAX_CHARACTERS_IN_ANSWER, userContent})

    return {
      data: JSON.parse(chatCompletion.choices[0].message.content || "{}")
    }
  }

  async generateEducationSummaryText(
    language: string,
    data: { institute?: string, degree?: string, location?: string, workingTime?: number }
  ) {
    const enteredData: string[] = []
    
    if (data.institute) {
      enteredData.push(`institute name: ${data.institute}`)
    }
    
    if (data.location) {
      enteredData.push(`location: ${data.location}`)
    }
    
    if (data.workingTime) {
      enteredData.push(`education time: ${data.workingTime} days`)
    }

    const userContent = `I studied at the institute for the degree of ${data.degree}, ${enteredData.join(", ")}. 
      Write a short description about my education experience in this institute`
    const chatCompletion = await this.getAnswerCore({language, maxCharacters: this.DEFAULT_MAX_CHARACTERS_IN_ANSWER, userContent})

    return {
      data: JSON.parse(chatCompletion.choices[0].message.content || "{}")
    }
  }

  async generateCourseSummaryText(
    language: string,
    data: {
      courseTitle: string
    }
  ) {
    const userContent = `I took the ${data.courseTitle} course, give me a brief description of what I learned with it. Write on my behalf`
    const chatCompletion = await this.getAnswerCore({language, maxCharacters: this.DEFAULT_MAX_CHARACTERS_IN_ANSWER, userContent})

    return {
      data: JSON.parse(chatCompletion.choices[0].message.content || "{}")
    }
  }
  
  async generateAchievementSummaryText(
    language: string,
    data: {
      achievementTitle: string
    }
  ) {
    const userContent = `I have ${data.achievementTitle} achievement, give it a short description. Write on my behalf`
    const chatCompletion = await this.getAnswerCore({language, maxCharacters: this.DEFAULT_MAX_CHARACTERS_IN_ANSWER, userContent})

    return {
      data: JSON.parse(chatCompletion.choices[0].message.content || "{}")
    }
  }
  
  async generateCertificateSummaryText(
    language: string,
    data: {
      certificateTitle: string
    }
  ) {
    const userContent = `I have ${data.certificateTitle} certificate, give it a short description. Write on my behalf`
    const chatCompletion = await this.getAnswerCore({language, maxCharacters: this.DEFAULT_MAX_CHARACTERS_IN_ANSWER, userContent})

    return {
      data: JSON.parse(chatCompletion.choices[0].message.content || "{}")
    }
  }
  
  async generateExtraActivitiesSummaryText(
    language: string,
    data: {
      position: string
      organization: string
      city: string
      workingTime: string
    }
  ) {
    const enteredData: string[] = []

    if (data.organization) {
      enteredData.push(`organization name: ${data.organization}`)
    }
    
    if (data.city) {
      enteredData.push(`city name: ${data.city}`)
    }
    
    if (data.workingTime) {
      enteredData.push(`working time in days: ${data.workingTime}`)
    }

    const userContent = `Write a short description about my extra activities on ${data.position} position, using the following information: ${enteredData.join(", ")}.
    Rounded up the extra activities time to years`
    const chatCompletion = await this.getAnswerCore({language, maxCharacters: this.DEFAULT_MAX_CHARACTERS_IN_ANSWER, userContent})

    return {
      data: JSON.parse(chatCompletion.choices[0].message.content || "{}")
    }
  }
  
  async generateIntershipsSummaryText(
    language: string,
    data: {
      position: string
      employer: string
      workingTime: string
    }
  ) {
    const enteredData: string[] = []
    
    if (data.employer) {
      enteredData.push(`employer name: ${data.employer}`)
    }
    
    if (data.workingTime) {
      enteredData.push(`interships time in days: ${data.workingTime}`)
    }

    const userContent = `Write a short description about my intership on ${data.position} position, using the following information: ${enteredData.join(", ")}.
    Rounded up intership time to years`
    const chatCompletion = await this.getAnswerCore({language, maxCharacters: this.DEFAULT_MAX_CHARACTERS_IN_ANSWER, userContent})

    return {
      data: JSON.parse(chatCompletion.choices[0].message.content || "{}")
    }
  }
  
  async generateCustomFieldsSummaryText(
    language: string,
    data: {
      title: string
    }
  ) {
    
    const userContent = `Write a short description about ${data.title}.`
    const chatCompletion = await this.getAnswerCore({language, maxCharacters: this.DEFAULT_MAX_CHARACTERS_IN_ANSWER, userContent})

    return {
      data: JSON.parse(chatCompletion.choices[0].message.content || "{}")
    }
  }

  async generateProfileSummaryText(
    language: string,
    data: {
      position: string
    }
  ) {
    
    const userContent = `Write a 2-3 sentence summary about my profile, using the following information: ${data.position}. Write on my behalf.`
    const chatCompletion = await this.getAnswerCore({language, maxCharacters: this.DEFAULT_MAX_CHARACTERS_IN_ANSWER, userContent})

    return {
      data: JSON.parse(chatCompletion.choices[0].message.content || "{}")
    }
  }
}
