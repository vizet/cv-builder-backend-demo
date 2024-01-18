import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose"
import {HydratedDocument} from "mongoose"

export type UserDocument = HydratedDocument<User>

@Schema({
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
}

export const UsersSchema = SchemaFactory.createForClass(User)
