import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { GithubWebhookController } from './github.controller';
import { KeycloakModule } from '../common/keycloak/keycloak.module';
import { KeycloakWebhookController } from './keycloak.controller';
import { GithubModule } from '../common/github/github.module';
import { ExercisesModule } from '../exercises/exercises.module';
import { GithubWebhookGuard } from './github.guard';
import { KeycloakWebhookGuard } from './keycloak.guard';

@Module({
	imports: [ProjectsModule, ExercisesModule, KeycloakModule, GithubModule],
	controllers: [GithubWebhookController, KeycloakWebhookController],
	providers: [GithubWebhookGuard, KeycloakWebhookGuard],
})
export class WebhooksModule {}
