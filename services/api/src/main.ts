import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppLogger } from './infra/logger';
import {
	DocumentBuilder,
	type SwaggerDocumentOptions,
	SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import type { AppConfig } from './infra/config/type';
import { HttpErrorDto } from './infra/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
	});

	const configService = app.get(ConfigService);
	const appConfig = configService.get<AppConfig['app']>('app')!;

	const swaggerOptions: SwaggerDocumentOptions = {
		operationIdFactory: (_controllerKey: string, methodKey: string) =>
			methodKey,
	};
	const swaggerConfig = new DocumentBuilder()
		.setTitle('Pathly API')
		.setVersion('1.0')
		.addGlobalResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			type: HttpErrorDto,
		})
		.addGlobalResponse({
			status: HttpStatus.BAD_REQUEST,
			type: HttpErrorDto,
		})
		.build();

	const documentFactory = () =>
		SwaggerModule.createDocument(app, swaggerConfig, swaggerOptions);
	SwaggerModule.setup('docs', app, documentFactory, {
		jsonDocumentUrl: 'docs/json',
		yamlDocumentUrl: 'docs/yaml',
		raw: ['json', 'yaml'],
	});

	app.enableVersioning();
	app.enableShutdownHooks();

	app.useLogger(new AppLogger());
	await app.listen(appConfig.port);
}

bootstrap();
