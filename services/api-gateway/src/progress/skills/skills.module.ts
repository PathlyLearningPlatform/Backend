import type { Options } from '@grpc/proto-loader'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { AuthModule } from '@/common/auth/auth.module'
import type { AppConfig } from '@/common/config'
import { DiToken } from '@/common/enums'
import { SKILLS_V1_PACKAGE_NAME } from '@pathly-backend/contracts/skills/v1/skill_progress.js'
import { join } from 'path'
import { SkillProgressController } from './skills.controller'
import { SkillProgressService } from './skills.service'

@Module({
	imports: [
		AuthModule,
		ClientsModule.registerAsync([
			{
				imports: [ConfigModule],
				name: DiToken.SKILL_PROGRESS_PACKAGE,
				async useFactory(configService: ConfigService) {
					const appConfig = configService.get<AppConfig['app']>('app')

					if (!appConfig) {
						throw new Error('App config is missing')
					}

					return {
						transport: Transport.GRPC,
						options: {
							package: SKILLS_V1_PACKAGE_NAME,
							protoPath: [
								join(appConfig.protoDir, 'skills/v1/skill_progress.proto'),
							],
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
	controllers: [SkillProgressController],
	providers: [SkillProgressService],
})
export class SkillProgressModule {}
