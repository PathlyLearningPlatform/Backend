import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { GithubWebhookController } from './github.controller';
import { KeycloakModule } from '../common/keycloak/keycloak.module';
import { KeycloakWebhookController } from './keycloak.controller';
import { GithubModule } from '../common/github/github.module';
import { ExercisesModule } from '../exercises/exercises.module';

@Module({
	imports: [ProjectsModule, ExercisesModule, KeycloakModule, GithubModule],
	controllers: [GithubWebhookController, KeycloakWebhookController],
})
export class WebhooksModule {}
