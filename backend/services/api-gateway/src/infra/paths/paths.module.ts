import type { Options } from '@grpc/proto-loader'
import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { COMMON_PACKAGE_NAME } from '@pathly-backend/contracts/common/types.js'
import { PATHS_V1_PACKAGE_NAME } from '@pathly-backend/contracts/paths/v1/paths.js'
import { DiToken } from '../common/enums'
import { PathsController } from './paths.controller'
import { PathsService } from './paths.service'

@Module({
	imports: [
		ClientsModule.register([
			{
				name: DiToken.PATHS_PACKAGE,
				transport: Transport.GRPC,
				options: {
					package: [PATHS_V1_PACKAGE_NAME, COMMON_PACKAGE_NAME],
					protoPath: [
						'/usr/src/app/libs/contracts/proto/paths/v1/paths.proto',
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
	controllers: [PathsController],
	providers: [PathsService],
})
export class PathsModule {}
