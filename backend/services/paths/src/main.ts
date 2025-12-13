import type { Options } from '@grpc/proto-loader';
import { ReflectionService } from '@grpc/reflection';
import { NestFactory } from '@nestjs/core';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppLogger } from '@pathly-backend/common/index.js';
import { PROTO_COMMON_PACKAGE_NAME } from '@pathly-backend/contracts/common/types.js';
import { PROTO_PATHS_V1_PACKAGE_NAME } from '@pathly-backend/contracts/paths/v1/paths.js';
import {
	HealthImplementation,
	protoPath as healthCheckProtoPath,
} from 'grpc-health-check';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		{
			transport: Transport.GRPC,
			options: {
				package: [PROTO_PATHS_V1_PACKAGE_NAME, PROTO_COMMON_PACKAGE_NAME],
				protoPath: [
					healthCheckProtoPath,
					'/usr/src/app/libs/contracts/proto/paths/v1/paths.proto',
					'/usr/src/app/libs/contracts/proto/common/types.proto',
				],
				url: `paths:3000`,
				onLoadPackageDefinition: (pkg, server) => {
					const healthImpl = new HealthImplementation({
						'': 'UNKNOWN',
					});

					healthImpl.addToServer(server);
					healthImpl.setStatus('', 'SERVING');

					new ReflectionService(pkg).addToServer(server);
				},
				loader: {
					includeDirs: [
						'/usr/src/app/libs/contracts/proto',
						'/usr/src/app/libs/contracts/proto/paths/v1',
						'/usr/src/app/libs/contracts/proto/common',
					],
				} as Options,
			},
			bufferLogs: true,
		},
	);
	app.useLogger(new AppLogger());
	await app.listen();
}

bootstrap();
