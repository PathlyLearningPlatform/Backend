import { Body, Controller, Inject, Post } from '@nestjs/common';
import { DiToken } from '../common';
import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller({
	path: 'webhooks/keycloak',
	version: '1',
})
export class KeycloakWebhookController {
	constructor(
		@Inject(DiToken.KEYCLOAK_CLIENT)
		private readonly keycloakClient: KeycloakAdminClient,
	) {}

	@ApiOkResponse()
	@Post()
	async keycloak(@Body() body): Promise<void> {
		console.log(body);
	}
}
