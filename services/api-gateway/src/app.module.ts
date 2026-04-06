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
import { validateConfig } from './common/config'
import { LearningPathsModule } from './learning-paths/learning-paths.module'
import { LessonsModule } from './lessons/lessons.module'
import { SectionsModule } from './sections/sections.module'
import { UnitsModule } from './units/units.module'
import { ProgressModule } from './progress/progress.module'
import { SkillsController } from './skills/skills.controller'
import { SkillsModule } from './skills/skills.module'

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
		ProgressModule,
		SkillsModule,
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
