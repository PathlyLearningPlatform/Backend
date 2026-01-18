import type { Options } from '@grpc/proto-loader';
import { ReflectionService } from '@grpc/reflection';
import { NestFactory } from '@nestjs/core';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppLogger } from '@pathly-backend/common/index.js';
import { COMMON_PACKAGE_NAME } from '@pathly-backend/contracts/common/types.js';
import { LEARNING_PATHS_V1_PACKAGE_NAME } from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js';
import {
	HealthImplementation,
	protoPath as healthCheckProtoPath,
} from 'grpc-health-check';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
	const protoDir = process.env.PROTO_DIR!;
	const hostname = process.env.HOSTNAME!;
	const port = process.env.PORT!;

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		{
			transport: Transport.GRPC,
			options: {
				package: [LEARNING_PATHS_V1_PACKAGE_NAME, COMMON_PACKAGE_NAME],
				protoPath: [
					healthCheckProtoPath,
					join(protoDir, 'learning-paths/v1/learning-paths.proto'),
					join(protoDir, 'learning-paths/v1/sections.proto'),
					join(protoDir, 'learning-paths/v1/units.proto'),
					join(protoDir, 'learning-paths/v1/lessons.proto'),
					join(protoDir, 'common/types.proto'),
				],
				url: `${hostname}:${port}`,
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
						join(protoDir),
						join(protoDir, 'learning-paths/v1'),
						join(protoDir, 'common'),
					],
					arrays: true,
					defaults: true,
					enums: String,
				} as Options,
			},
			bufferLogs: true,
		},
	);
	app.useLogger(new AppLogger());
	await app.listen();
}

bootstrap();
