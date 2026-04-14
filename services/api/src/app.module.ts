import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HttpExceptionFilter, HttpRequestInterceptor } from '@infra/common';
import { AppService } from './app.service';
import { ActivitiesModule } from './infra/activities/activities.module';
import { InMemoryEventBus } from '@infra/common';
import { validateConfig } from './infra/config';
import { DbModule } from './infra/db/db.module';
import { eventHandlersProvider } from './infra/event-handlers.provider';
import { LearningPathsModule } from './infra/learning-paths/learning-paths.module';
import { LessonsModule } from './infra/lessons/lessons.module';
import { SectionsModule } from './infra/sections/sections.module';
import { UnitsModule } from './infra/units/units.module';
import { AppController } from './app.controller';
import { AppLoggerModule } from './infra/logger';
import { SkillsModule } from './infra/skills/skills.module';

@Module({
	imports: [
		DbModule,
		ConfigModule.forRoot({
			validate: validateConfig,
			isGlobal: true,
			ignoreEnvFile: true,
		}),
		AppLoggerModule.register({
			isGlobal: true,
		}),
		EventEmitterModule.forRoot({
			wildcard: true,
			delimiter: '.',
			global: true,
		}),
		LearningPathsModule,
		SectionsModule,
		UnitsModule,
		LessonsModule,
		ActivitiesModule,
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
		InMemoryEventBus,
		...eventHandlersProvider,
		AppService,
	],
	controllers: [AppController],
})
export class AppModule {}
