import { NestFactory } from '@nestjs/core';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppLogger } from 'common/index.js';
import { PROTO_PATHS_V1_PACKAGE_NAME } from 'contracts/paths/v1/paths.js';
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
				package: PROTO_PATHS_V1_PACKAGE_NAME,
				protoPath: [
					healthCheckProtoPath,
					'/usr/src/app/libs/contracts/proto/paths/v1/paths.proto',
				],
				url: `paths:3000`,
				onLoadPackageDefinition: (pkg, server) => {
					const healthImpl = new HealthImplementation({
						'': 'UNKNOWN',
					});

					healthImpl.addToServer(server);
					healthImpl.setStatus('', 'SERVING')
				},
			},
			bufferLogs: true,
		},
	);
	app.useLogger(new AppLogger());
	await app.listen();
}

bootstrap();
