import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
	AppLoggerModule, RpcRequestInterceptor
} from '@pathly-backend/common';
import { validateConfig } from './infra/config';
import { DbModule } from './infra/db/db.module';
import { LearningPathsModule } from './infra/learning-paths/learning-paths.module';
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
		LearningPathsModule,
		SectionsModule,
		UnitsModule,
	],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: RpcRequestInterceptor,
		},
	],
})
export class AppModule {}
