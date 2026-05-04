import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { DiToken } from '../common';
import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { ApiOkResponse } from '@nestjs/swagger';
import { KeycloakWebhookGuard } from './keycloak.guard';

@UseGuards(KeycloakWebhookGuard)
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
