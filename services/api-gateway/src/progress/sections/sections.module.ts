import { Module } from '@nestjs/common'
import { SectionProgressService } from './sections.service'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule } from '@nestjs/config'
import { DiToken } from '@/common/enums'
import { ConfigService } from '@nestjs/config'
import type { AppConfig } from '@/common/config'
import { PROGRESS_V1_PACKAGE_NAME } from '@pathly-backend/contracts/progress/v1/sections.js'
import { join } from 'path'
import type { Options } from '@grpc/proto-loader'
import { SectionProgressController } from './sections.controller'
import { AuthModule } from '@/common/auth/auth.module'

@Module({
	imports: [
		AuthModule,
		ClientsModule.registerAsync([
			{
				imports: [ConfigModule],
				name: DiToken.SECTION_PROGRESS_PACKAGE,
				async useFactory(configService: ConfigService) {
					const appConfig = configService.get<AppConfig['app']>('app')!

					return {
						transport: Transport.GRPC,
						options: {
							package: PROGRESS_V1_PACKAGE_NAME,
							protoPath: [
								join(appConfig.protoDir, 'progress/v1/sections.proto'),
							],
							url: appConfig.progressServiceUrl,
							loader: {
								includeDirs: [
									join(appConfig.protoDir),
									join(appConfig.protoDir, 'progress/v1'),
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
	controllers: [SectionProgressController],
	providers: [SectionProgressService],
})
export class SectionProgressModule {}
