import { HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import {
	DocumentBuilder,
	type SwaggerDocumentOptions,
	SwaggerModule,
} from '@nestjs/swagger'
import { AppLogger, HttpErrorResponse } from '@pathly-backend/common'
import { AppModule } from './app.module'
import type { AppConfig } from './infra/common/types'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
	})

	const swaggerOptions: SwaggerDocumentOptions = {
		operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
	}
	const swaggerConfig = new DocumentBuilder()
		.setTitle('Pathly API')
		.setVersion('1.0')
		.addGlobalResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			type: HttpErrorResponse,
		})
		.addGlobalResponse({
			status: HttpStatus.BAD_REQUEST,
			type: HttpErrorResponse,
		})
		.build()
	const documentFactory = () =>
		SwaggerModule.createDocument(app, swaggerConfig, swaggerOptions)
	SwaggerModule.setup('docs', app, documentFactory, {
		jsonDocumentUrl: 'docs/json',
		yamlDocumentUrl: 'docs/yaml',
		raw: ['json', 'yaml'],
	})

	const configService = app.get(ConfigService)
	const appConfig = configService.get<AppConfig['app']>('app')!

	app.useLogger(new AppLogger())
	app.enableVersioning()

	await app.listen(appConfig.port)
}

bootstrap()
