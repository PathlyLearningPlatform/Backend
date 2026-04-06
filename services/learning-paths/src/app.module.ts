import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppLoggerModule, RpcRequestInterceptor } from '@pathly-backend/common';
import { AppService } from './app.service';
import { ActivitiesModule } from './infra/activities/activities.module';
import { InMemoryEventBus } from './infra/common/adapters';
import { validateConfig } from './infra/common/config';
import { DbModule } from './infra/common/db/db.module';
import { eventHandlersProvider } from './infra/event-handlers.provider';
import { LearningPathsModule } from './infra/learning-paths/learning-paths.module';
import { LessonsModule } from './infra/lessons/lessons.module';
import { SectionsModule } from './infra/sections/sections.module';
import { UnitsModule } from './infra/units/units.module';

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
	],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: RpcRequestInterceptor,
		},
		InMemoryEventBus,
		...eventHandlersProvider,
		AppService,
	],
})
export class AppModule {}
