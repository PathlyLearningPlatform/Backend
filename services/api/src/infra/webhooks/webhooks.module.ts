import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { WebhooksController } from './webhooks.controller';
import { KeycloakAdminModule } from '../common/keycloak-admin/keycloak-admin.module';

@Module({
	imports: [ProjectsModule, KeycloakAdminModule],
	controllers: [WebhooksController],
})
export class WebhooksModule {}
