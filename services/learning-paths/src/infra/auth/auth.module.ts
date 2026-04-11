import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppException } from '@infra/common';
import { readFile } from 'node:fs/promises';
import type { AppConfig } from '../config/type';
import { JwtGuard } from './jwt.guard';

@Module({
	imports: [
		JwtModule.registerAsync({
			async useFactory(configService: ConfigService) {
				const appConfig = configService.get<AppConfig['app']>('app');

				if (!appConfig) {
					throw new AppException('missing app configuration', false);
				}
				let cert: Buffer<ArrayBuffer>;

				try {
					cert = await readFile(appConfig.jwtPublicKeyPath);
				} catch (err) {
					throw new AppException(
						`failed to read public key from location: ${appConfig.jwtPublicKeyPath}`,
						false,
						err,
					);
				}

				return {
					publicKey: cert,
					verifyOptions: {
						audience: [appConfig.jwtAudience],
						issuer: appConfig.jwtIssuer,
					},
				};
			},
			inject: [ConfigService],
		}),
	],
	providers: [JwtGuard],
	exports: [JwtModule, JwtGuard],
})
export class AuthModule {}
