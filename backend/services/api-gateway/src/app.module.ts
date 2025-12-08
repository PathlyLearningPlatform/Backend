import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import {
	AppLoggerModule,
	HttpExceptionFilter,
	HttpRequestInterceptor,
} from 'common/index.js'
import { AppController } from './app.controller'
import { validateConfig } from './infra/config'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: true,
			validate: validateConfig,
		}),
		AppLoggerModule.register({
			isGlobal: true,
		}),
	],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: HttpRequestInterceptor,
		},
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
	],
	controllers: [AppController],
})
export class AppModule {}
