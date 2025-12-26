import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import {
	AppLoggerModule,
	HttpExceptionFilter,
	HttpRequestInterceptor,
} from '@pathly-backend/common'
import { AppController } from './app.controller'
import { validateConfig } from './infra/config'
import { PathsModule } from './infra/paths/paths.module'
import { SectionsModule } from './infra/sections/sections.module'
import { UnitsModule } from './infra/units/units.module'

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
		PathsModule,
		SectionsModule,
		UnitsModule,
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
