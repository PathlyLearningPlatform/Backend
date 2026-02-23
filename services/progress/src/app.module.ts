import { Module } from '@nestjs/common';
import { DbModule } from './infra/db/db.module';
import { ConfigModule } from '@nestjs/config';
import { validateConfig } from './infra/config';
import {
	AppLoggerModule,
	RpcRequestInterceptor,
} from '@pathly-backend/common/index.js';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ActivityProgressModule } from './infra/activity-progress/activity-progress.module';

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
		ActivityProgressModule,
	],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: RpcRequestInterceptor,
		},
	],
})
export class AppModule {}
