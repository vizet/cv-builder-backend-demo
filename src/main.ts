import {NestFactory} from "@nestjs/core"
import {AppModule} from "./app.module"
import {ConfigService} from "@nestjs/config"

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  })
  const configService: ConfigService = app.get<ConfigService>(ConfigService)
  const port = configService.get("port")

  await app.listen(port)
}

bootstrap()
