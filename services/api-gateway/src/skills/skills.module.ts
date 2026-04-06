import type { Options } from '@grpc/proto-loader'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { SKILLS_V1_PACKAGE_NAME } from '@pathly-backend/contracts/skills/v1/skills.js'
import { join } from 'path'
import type { AppConfig } from '../common/config'
import { DiToken } from '../common/enums'
import { SkillsService } from './skills.service'
import { SkillsController } from './skills.controller'

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				imports: [ConfigModule],
				name: DiToken.SKILLS_PACKAGE,
				async useFactory(configService: ConfigService) {
					const appConfig = configService.get<AppConfig['app']>('app')

					if (!appConfig) {
						throw new Error('App config is missing')
					}

					return {
						transport: Transport.GRPC,
						options: {
							package: [SKILLS_V1_PACKAGE_NAME],
							protoPath: [join(appConfig.protoDir, 'skills/v1/skills.proto')],
							url: appConfig.skillsServiceUrl,
							loader: {
								includeDirs: [
									join(appConfig.protoDir),
									join(appConfig.protoDir, 'skills/v1'),
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
	providers: [SkillsService],
	controllers: [SkillsController],
})
export class SkillsModule {}
