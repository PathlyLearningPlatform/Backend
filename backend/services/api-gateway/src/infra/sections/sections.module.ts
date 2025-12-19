import { Module } from '@nestjs/common'
import { SectionsController } from './sections.controller'
import { SectionsService } from './sections.service'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { PATHS_V1_PACKAGE_NAME } from '@pathly-backend/contracts/paths/v1/sections.js'
import { DiToken } from '../common/enums'
import { COMMON_PACKAGE_NAME } from '@pathly-backend/contracts/common/types.js'
import { Options } from '@grpc/proto-loader'

@Module({
	imports: [
		ClientsModule.register([
			{
				name: DiToken.SECTIONS_PACKAGE,
				transport: Transport.GRPC,
				options: {
					package: [PATHS_V1_PACKAGE_NAME, COMMON_PACKAGE_NAME],
					protoPath: [
						'/usr/src/app/libs/contracts/proto/paths/v1/sections.proto',
						'/usr/src/app/libs/contracts/proto/common/types.proto',
					],
					url: 'paths:3000',
					loader: {
						includeDirs: [
							'/usr/src/app/libs/contracts/proto',
							'/usr/src/app/libs/contracts/proto/paths/v1',
							'/usr/src/app/libs/contracts/proto/common',
						],
						arrays: true,
						defaults: true,
					} as Options,
				},
			},
		]),
	],
	controllers: [SectionsController],
	providers: [SectionsService],
})
export class SectionsModule {}
