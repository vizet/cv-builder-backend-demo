import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose"
import {HydratedDocument} from "mongoose"

export type UserDocument = HydratedDocument<User>

@Schema({
  id: false,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  },
  versionKey: false
})
export class User {
  @Prop({
    unique: true
  })
  email: string

  @Prop({
    default: null
  })
  password: string | null

  @Prop({
    default: ""
  })
  avatar: string

  @Prop({
    default: ""
  })
  firstName: string

  @Prop({
    default: ""
  })
  lastName: string

  fullName: string

  @Prop({
    default: false
  })
  emailVerified: boolean
}

const UsersSchema = SchemaFactory.createForClass(User)

UsersSchema.virtual("fullName").get(function () {
  if (this.firstName || this.lastName) {
    return `${this.firstName} ${this.lastName}`
  } else if (this.firstName) {
    return this.firstName
  } else if (this.lastName) {
    return this.lastName
  } else {
    return ""
  }
})

export {UsersSchema}
