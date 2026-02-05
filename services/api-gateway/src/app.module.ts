import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import {
	AppLoggerModule,
	HttpExceptionFilter,
	HttpRequestInterceptor,
} from '@pathly-backend/common'
import { ActivitiesModule } from './activities/activities.module'
import { AppController } from './app.controller'
import { validateConfig } from './config'
import { LearningPathsModule } from './learning-paths/learning-paths.module'
import { LessonsModule } from './lessons/lessons.module'
import { SectionsModule } from './sections/sections.module'
import { UnitsModule } from './units/units.module'

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
		LearningPathsModule,
		SectionsModule,
		UnitsModule,
		LessonsModule,
		ActivitiesModule,
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
