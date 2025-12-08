import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import {
	AppLoggerModule,
	RpcExceptionFilter,
	RpcRequestInterceptor,
} from 'common';
import { validateConfig } from './infra/config';
import { DbModule } from './infra/db/db.module';

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
		{
			provide: APP_FILTER,
			useClass: RpcExceptionFilter,
		},
	],
})
export class AppModule {}
