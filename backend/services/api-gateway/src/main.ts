import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppLogger } from 'common/index.js'
import { AppModule } from './app.module'
import type { AppConfig } from './infra/common/types'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
	})

	const configService = app.get(ConfigService)
	const appConfig = configService.get<AppConfig['app']>('app')!

	app.useLogger(new AppLogger())

	await app.listen(appConfig.port)
}

bootstrap()
