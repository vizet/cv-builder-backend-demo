import {Module} from "@nestjs/common"
import {MongooseModule} from "@nestjs/mongoose"
import {UsersService} from "./users.service"
import {User, UsersSchema} from "./users.schema"

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: User.name,
      schema: UsersSchema
    }])
  ],
  providers: [UsersService],
  exports: [UsersService]
})

export class UsersModule {}
