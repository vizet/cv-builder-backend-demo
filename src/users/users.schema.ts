import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose"
import {HydratedDocument, Types} from "mongoose"

export type UserDocument = HydratedDocument<User>
export type UserObject = User & {_id: Types.ObjectId}

@Schema({
  _id: false,
  id: false
})
class EmailVerification {
  @Prop({
    default: false
  })
  isVerified: boolean

  @Prop({
    select: false,
    default: ""
  })
  token: string | null

  @Prop({
    select: false,
    default: null
  })
  tokenDateCreated: Date | null
}

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

  @Prop()
  emailVerification: EmailVerification

  @Prop({
    select: false,
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
