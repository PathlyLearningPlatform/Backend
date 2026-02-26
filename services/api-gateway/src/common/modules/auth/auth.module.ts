import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { JwtGuard } from './jwt.guard'
import { ConfigService } from '@nestjs/config'
import { readFile } from 'node:fs/promises'
import { AppException } from '@pathly-backend/common/index.js'

@Module({
	imports: [
		JwtModule.registerAsync({
			async useFactory(configService: ConfigService) {
				const location = `${process.cwd()}/jwt-public-key.pem`
				let cert: Buffer<ArrayBuffer>

				try {
					cert = await readFile(location)
				} catch (err) {
					throw new AppException(
						`failed to read public key from location: ${location}`,
						false,
						err,
					)
				}

				return {
					publicKey: cert,
					verifyOptions: {
						audience: 'test-client',
						issuer: 'http://localhost:8080/realms/pathly',
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
