import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose"
import {HydratedDocument, Types} from "mongoose"

export type ResumeDocument = HydratedDocument<Resume>

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: "dateCreated",
    updatedAt: "dateUpdated"
  }
})
export class Resume {
  @Prop({
    default: ""
  })
  title: string

  @Prop({
    type: Types.ObjectId,
    ref: "User",
    remove: true
  })
  author: Types.ObjectId

  @Prop({
    default: ""
  })
  preview: string

  @Prop({
    type: Object
  })
  data: {
    template: string
    theme: {
      textStyle: {
        font: string
        fontSize: number
        fontSpacing: number
      }
      palette: string
    }
    sections: {
      profile: {
        avatar: string
        firstName: string
        lastName: string
        email: string
        position: string
        profile: string
        phoneNumber: string
        address: string
        postcode: string
        city: string
        dateOfBirth: string
        gender: string
        nationality: string
        website: string
        linkedin: string
        custom: string
      }
      education: Education[]
      workExperience: WorkExperience[]
      skills: Skill[]
      languages: Language[]
      hobbies: Hobby[]
      courses: Course[]
      internships: Internship[]
    }
    meta: {
      profileAdditionalFields: string[]
      sectionsOrder: string[]
    }
  }
}

type Education = {
  id: string
  title: string
  degree: string
  institute: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  summary: string
}

type WorkExperience = {
  id: string
  title: string
  jobTitle: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  summary: string
}

type Skill = {
  id: string
  title: string
  level: number
}

type Language = {
  id: string
  title: string
  level: number
}

type Hobby = {
  id: string
  title: string
}

type Course = {
  id: string
  title: string
  period: string
  description: string
}

type Internship = {
  id: string
  position: string
  employer: string
  startDate: string
  endDate: string
  description: string
}

export const ResumeSchema = SchemaFactory.createForClass(Resume)
