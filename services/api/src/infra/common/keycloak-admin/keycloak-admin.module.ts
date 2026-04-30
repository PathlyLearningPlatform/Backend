import { Module } from '@nestjs/common';
import { DiToken } from '../enums';
import { ConfigService } from '@nestjs/config';
import { Config } from '@/infra/config/types';
import { ConfigException } from '../exceptions';
import KcAdminClient from '@keycloak/keycloak-admin-client';

@Module({
	imports: [],
	providers: [
		{
			provide: DiToken.KEYCLOAK_ADMIN_CLIENT,
			async useFactory(configService: ConfigService) {
				const keycloakConfig =
					configService.get<Config['keycloak']>('keycloak')!;

				if (!keycloakConfig) {
					throw new ConfigException('failed to load keycloak configuration');
				}

				const adminClient = new KcAdminClient({
					baseUrl: keycloakConfig.baseUrl,
					realmName: keycloakConfig.realmName,
				});
				await adminClient.auth({
					clientId: keycloakConfig.clientId,
					clientSecret: keycloakConfig.clientSecret,
					grantType: 'client_credentials',
				});

				return adminClient;
			},
			inject: [ConfigService],
		},
	],
	exports: [DiToken.KEYCLOAK_ADMIN_CLIENT],
})
export class KeycloakAdminModule {}
