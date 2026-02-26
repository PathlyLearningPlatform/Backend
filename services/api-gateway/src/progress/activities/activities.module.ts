import { Module } from '@nestjs/common'
import { ActivityProgressService } from './activities.service'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule } from '@nestjs/config'
import { DiToken } from '@/common/enums'
import { ConfigService } from '@nestjs/config'
import { AppConfig } from '@/common/types'
import { COMMON_PACKAGE_NAME } from '@pathly-backend/contracts/common/types.js'
import { PROGRESS_V1_PACKAGE_NAME } from '@pathly-backend/contracts/progress/v1/activities.js'
import { join } from 'path'
import { Options } from '@grpc/proto-loader'
import { ActivityProgressController } from './activities.controller'
import { AuthModule } from '@/common/modules/auth/auth.module'

@Module({
	imports: [
		AuthModule,
		ClientsModule.registerAsync([
			{
				imports: [ConfigModule],
				name: DiToken.ACTIVITY_PROGRESS_PACKAGE,
				async useFactory(configService: ConfigService) {
					const appConfig = configService.get<AppConfig['app']>('app')!

					return {
						transport: Transport.GRPC,
						options: {
							package: [COMMON_PACKAGE_NAME, PROGRESS_V1_PACKAGE_NAME],
							protoPath: [
								join(appConfig.protoDir, 'progress/v1/activities.proto'),
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
	controllers: [ActivityProgressController],
	providers: [ActivityProgressService],
})
export class ActivityProgressModule {}
