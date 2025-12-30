import type { Options } from '@grpc/proto-loader'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { COMMON_PACKAGE_NAME } from '@pathly-backend/contracts/common/types.js'
import { LEARNING_PATHS_V1_PACKAGE_NAME } from '@pathly-backend/contracts/learning-paths/v1/sections.js'
import { join } from 'path'
import { DiToken } from '../common/enums'
import type { AppConfig } from '../common/types'
import { SectionsController } from './sections.controller'
import { SectionsService } from './sections.service'

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				imports: [ConfigModule],
				name: DiToken.SECTIONS_PACKAGE,
				async useFactory(configService: ConfigService) {
					const appConfig = configService.get<AppConfig['app']>('app')!

					return {
						transport: Transport.GRPC,
						options: {
							package: [LEARNING_PATHS_V1_PACKAGE_NAME, COMMON_PACKAGE_NAME],
							protoPath: [
								join(appConfig.protoDir, 'learning-paths/v1/sections.proto'),
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
					}
				},
				inject: [ConfigService],
			},
		]),
	],
	controllers: [SectionsController],
	providers: [SectionsService],
})
export class SectionsModule {}
