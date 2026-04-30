import { Body, Controller, Headers, Inject, Post } from '@nestjs/common';
import { DiToken } from '../common';
import {
	CreateProjectHandler,
	StartProjectHandler,
	SubmitProjectHandler,
} from '@/app/projects';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { GithubWebhookDto } from './dtos/github.dto';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config/types';
import { Octokit } from 'octokit';
import KeycloakAdminClient from '@keycloak/keycloak-admin-client';

@Controller({
	path: 'webhooks',
	version: '1',
})
export class WebhooksController {
	private readonly githubConfig: Config['github'];
	private octokit!: Octokit;

	constructor(
		@Inject(ConfigService)
		private readonly configService: ConfigService,
		@Inject(DiToken.CREATE_PROJECT_HANDLER)
		private readonly createProjectHandler: CreateProjectHandler,
		@Inject(DiToken.SUBMIT_PROJECT_HANDLER)
		private readonly submitProjectHandler: SubmitProjectHandler,
		@Inject(DiToken.START_PROJECT_HANDLER)
		private readonly startProjectHandler: StartProjectHandler,
		@Inject(DiToken.KEYCLOAK_ADMIN_CLIENT)
		private readonly kcAdminClient: KeycloakAdminClient,
	) {
		this.githubConfig = this.configService.get<Config['github']>('github')!;
		this.octokit = new Octokit({
			auth: this.githubConfig.projectsClassroomPAT,
		});
	}

	@ApiBody({ type: GithubWebhookDto })
	@ApiOkResponse()
	@Post('github')
	async github(
		@Headers('x-github-event') xGithubEvent: string,
		@Body(/*new HttpValidationPipe(githubWebhookSchema)*/)
		body: GithubWebhookDto,
	): Promise<void> {
		if (xGithubEvent === 'repository') {
			if (body.action === 'created' && body.repository) {
				const repoName = body.repository.name;
				const classroomName = repoName.split('-')[0];
				const assignmentSlug = repoName.split('-')[1];

				const ghUserId = body.sender.id;

				const [user] = await this.kcAdminClient.users.find({
					idpAlias: 'github',
					idpUserId: ghUserId,
				});

				console.log(user);
				console.log(body);

				if (classroomName === 'pathlyprojects') {
					const res = await this.octokit.request(
						'GET /classrooms/{classroom_id}/assignments',
						{
							classroom_id: this.githubConfig.projectsClassroomId,
						},
					);

					for (const assignment of res.data) {
						if (assignment.slug === assignmentSlug) {
							console.log(assignment);
							await this.createProjectHandler.execute({
								name: assignment.slug,
								acceptUrl: assignment.invite_link,
							});
							break;
						}
					}
				}
			}
		}
		// TODO: handle exercise created case
		// TODO: handle exercise accepted case
		// TODO: handle exercise submitted case
		// TODO: handle project created case
		// TODO: handle project accepted case
		// TODO: handle project submitted case
	}

	@ApiOkResponse()
	@Post('keycloak')
	async keycloak(@Body() body): Promise<void> {
		console.log(body);
	}
}
