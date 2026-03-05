import type { Options } from '@grpc/proto-loader';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { COMMON_PACKAGE_NAME } from '@pathly-backend/contracts/common/types.js';
import { LEARNING_PATHS_V1_PACKAGE_NAME } from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js';
import { join } from 'path';
import { DiToken } from '../../enums';
import type { Config } from '../../types';
import { LearningPathsService } from './learning-paths.service';

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				imports: [ConfigModule],
				name: DiToken.LEARNING_PATHS_PACKAGE,
				async useFactory(configService: ConfigService) {
					const appConfig = configService.get<Config['app']>('app')!;

					return {
						transport: Transport.GRPC,
						options: {
							package: [LEARNING_PATHS_V1_PACKAGE_NAME, COMMON_PACKAGE_NAME],
							protoPath: [
								join(appConfig.protoDir, 'learning-paths/v1/activities.proto'),
								join(appConfig.protoDir, 'learning-paths/v1/lessons.proto'),
								join(appConfig.protoDir, 'common/types.proto'),
							],
							url: appConfig.learningPathsServiceUrl,
							loader: {
								includeDirs: [
									join(appConfig.protoDir),
									join(appConfig.protoDir, 'learning-paths/v1'),
									join(appConfig.protoDir, 'common'),
								],
								arrays: true,
								defaults: true,
							} as Options,
						},
					};
				},
				inject: [ConfigService],
			},
		]),
	],
	providers: [LearningPathsService],
	exports: [LearningPathsService],
})
export class LearningPathsModule {}
