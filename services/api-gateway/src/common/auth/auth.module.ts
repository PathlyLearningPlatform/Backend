import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { JwtGuard } from './jwt.guard'
import { ConfigService } from '@nestjs/config'
import { readFile } from 'node:fs/promises'
import { AppException } from '@pathly-backend/common/index.js'
import { AppConfig } from '../config'

@Module({
	imports: [
		JwtModule.registerAsync({
			async useFactory(configService: ConfigService) {
				const appConfig = configService.get<AppConfig['app']>('app')!
				let cert: Buffer<ArrayBuffer>

				try {
					cert = await readFile(appConfig.jwtPublicKeyPath)
				} catch (err) {
					throw new AppException(
						`failed to read public key from location: ${appConfig.jwtPublicKeyPath}`,
						false,
						err,
					)
				}

				return {
					publicKey: cert,
					verifyOptions: {
						audience: appConfig.jwtAudience,
						issuer: appConfig.jwtIssuer,
					},
				}
			},
			inject: [ConfigService],
		}),
	],
	providers: [JwtGuard],
	exports: [JwtModule, JwtGuard],
})
export class AuthModule {}
