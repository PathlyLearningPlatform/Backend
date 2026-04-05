import type { Options } from '@grpc/proto-loader';
import { ReflectionService } from '@grpc/reflection';
import { NestFactory } from '@nestjs/core';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppLogger } from '@pathly-backend/common/index.js';
import { SKILLS_V1_PACKAGE_NAME } from '@pathly-backend/contracts/skills/v1/skills.js';
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
				package: SKILLS_V1_PACKAGE_NAME,
				protoPath: [
					healthCheckProtoPath,
					join(protoDir, 'skills/v1/skills.proto'),
					join(protoDir, 'skills/v1/skill_progress.proto'),
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
					includeDirs: [join(protoDir), join(protoDir, 'skills/v1')],
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
