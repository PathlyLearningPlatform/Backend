import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { validateConfig } from './infra/config';
import {
	AppLoggerModule,
	RpcRequestInterceptor,
} from '@pathly-backend/common/index.js';
import { ActivityProgressModule } from './infra/activity-progress/activity-progress.module';
import { LessonProgressModule } from './infra/lesson-progress/lesson-progress.module';
import { EventsModule } from './infra/common/modules/events/events.module';
import { EventsHandlerModule } from './infra/events-handler/events-handler.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
	imports: [
		EventEmitterModule.forRoot({
			wildcard: true,
			delimiter: '.',
		}),
		EventsModule,
		EventsHandlerModule,
		ConfigModule.forRoot({
			validate: validateConfig,
			isGlobal: true,
			ignoreEnvFile: true,
		}),
		AppLoggerModule.register({
			isGlobal: true,
		}),
		ActivityProgressModule,
		LessonProgressModule,
	],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: RpcRequestInterceptor,
		},
	],
})
export class AppModule {}
