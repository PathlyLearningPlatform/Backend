import { Module } from '@nestjs/common';
import { DbModule } from './infra/db/db.module';
import { ConfigModule } from '@nestjs/config';
import { validateConfig } from './infra/config';
import {
	AppLoggerModule,
	RpcRequestInterceptor,
} from '@pathly-backend/common/index.js';
import { APP_INTERCEPTOR } from '@nestjs/core';

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
	],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: RpcRequestInterceptor,
		},
	],
})
export class AppModule {}
