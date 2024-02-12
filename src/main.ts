import {NestFactory} from "@nestjs/core"
import {json} from "express"
import {AppModule} from "./app.module"
import {ConfigService} from "@nestjs/config"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService: ConfigService = app.get<ConfigService>(ConfigService)
  const port = configService.get("port")

  app.enableCors()

  app.use(json({
    limit: "10mb"
  }))

  await app.listen(port)
}

bootstrap()
