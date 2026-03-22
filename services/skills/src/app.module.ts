import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
	AppLoggerModule,
	RpcRequestInterceptor,
} from '@pathly-backend/common/index.js';
import { ConfigModule } from '@nestjs/config';
import { validateConfig } from './infra/common';
import { SkillsModule } from './infra/skills/skills.module';

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
		SkillsModule,
	],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: RpcRequestInterceptor,
		},
	],
})
export class AppModule {}
