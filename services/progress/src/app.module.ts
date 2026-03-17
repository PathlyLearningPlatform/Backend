import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
	AppLoggerModule,
	RpcRequestInterceptor,
} from '@pathly-backend/common/index.js';
import { ActivityProgressModule } from './infra/activity-progress/activity-progress.module';
import { LessonProgressModule } from './infra/lesson-progress/lesson-progress.module';
import { LearningPathProgressModule } from './infra/learning-path-progress/learning-path-progress.module';
import { SectionProgressModule } from './infra/section-progress/section-progress.module';
import { UnitProgressModule } from './infra/unit-progress/unit-progress.module';
import { ConfigModule } from '@nestjs/config';
import { InMemoryEventBus, validateConfig } from './infra/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppService } from './app.service';
import { eventHandlersProvider } from './infra/event-handlers.provider';

@Module({
	imports: [
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
		ActivityProgressModule,
		LessonProgressModule,
		LearningPathProgressModule,
		SectionProgressModule,
		UnitProgressModule,
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
