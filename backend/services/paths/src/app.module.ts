import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import {
	AppLoggerModule,
	GrpcExceptionFilter,
	RpcRequestInterceptor,
} from '@pathly-backend/common';
import { validateConfig } from './infra/config';
import { DbModule } from './infra/db/db.module';
import { PathsModule } from './infra/paths/paths.module';
import { SectionsModule } from './infra/sections/sections.module';

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
		PathsModule,
		SectionsModule,
	],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: RpcRequestInterceptor,
		},
	],
})
export class AppModule {}
