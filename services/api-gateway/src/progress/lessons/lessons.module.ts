import { Module } from '@nestjs/common'
import { LessonProgressService } from './lessons.service.js'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule } from '@nestjs/config'
import { DiToken } from '@/common/enums'
import { ConfigService } from '@nestjs/config'
import type { AppConfig } from '@/common/types'
import { COMMON_PACKAGE_NAME } from '@pathly-backend/contracts/common/types.js'
import { PROGRESS_V1_PACKAGE_NAME } from '@pathly-backend/contracts/progress/v1/lessons.js'
import { join } from 'path'
import type { Options } from '@grpc/proto-loader'
import { LessonProgressController } from './lessons.controller.js'
import { AuthModule } from '@/common/modules/auth/auth.module'

@Module({
	imports: [
		AuthModule,
		ClientsModule.registerAsync([
			{
				imports: [ConfigModule],
				name: DiToken.LESSON_PROGRESS_PACKAGE,
				async useFactory(configService: ConfigService) {
					const appConfig = configService.get<AppConfig['app']>('app')!

					return {
						transport: Transport.GRPC,
						options: {
							package: [COMMON_PACKAGE_NAME, PROGRESS_V1_PACKAGE_NAME],
							protoPath: [
								join(appConfig.protoDir, 'progress/v1/lessons.proto'),
								join(appConfig.protoDir, 'common/types.proto'),
							],
							url: appConfig.progressServiceUrl,
							loader: {
								includeDirs: [
									join(appConfig.protoDir),
									join(appConfig.protoDir, 'progress/v1'),
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
	controllers: [LessonProgressController],
	providers: [LessonProgressService],
})
export class LessonProgressModule {}
