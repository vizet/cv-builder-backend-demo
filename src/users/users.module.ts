import {forwardRef, Module} from "@nestjs/common"
import {MongooseModule} from "@nestjs/mongoose"
import {AuthModule} from "src/auth/auth.module"
import {UsersService} from "./users.service"
import {User, UsersSchema} from "./users.schema"
import {CDNModule} from "src/cdn/cdn.module"

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: User.name,
      schema: UsersSchema
    }]),
    forwardRef(() => AuthModule),
    CDNModule
  ],
  providers: [UsersService],
  exports: [UsersService]
})

export class UsersModule {}
