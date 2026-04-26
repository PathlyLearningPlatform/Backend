import { Body, Controller, Headers, Inject, Post } from '@nestjs/common';
import { DiToken, HttpValidationPipe } from '../common';
import {
	CreateProjectHandler,
	StartProjectHandler,
	SubmitProjectHandler,
} from '@/app/projects';
import { githubWebhookSchema } from './schemas';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { GithubWebhookDto } from './dtos/github.dto';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config/type';

@Controller({
	path: 'webhooks',
	version: '1',
})
export class WebhooksController {
	private readonly githubConfig: Config['github'];

	constructor(
		@Inject(ConfigService)
		private readonly configService: ConfigService,
		@Inject(DiToken.CREATE_PROJECT_HANDLER)
		private readonly createProjectHandler: CreateProjectHandler,
		@Inject(DiToken.SUBMIT_PROJECT_HANDLER)
		private readonly submitProjectHandler: SubmitProjectHandler,
		@Inject(DiToken.START_PROJECT_HANDLER)
		private readonly startProjectHandler: StartProjectHandler,
	) {
		this.githubConfig = this.configService.get<Config['github']>('github')!;
	}

	@ApiBody({ type: GithubWebhookDto })
	@ApiOkResponse()
	@Post('github')
	async github(
		@Headers('x-github-event') xGithubEvent: string,
		@Body(new HttpValidationPipe(githubWebhookSchema)) body: GithubWebhookDto,
	): Promise<void> {
		// TODO: handle exercise created case
		// TODO: handle exercise accepted case
		// TODO: handle exercise submitted case
		// TODO: handle project created case
		// TODO: handle project accepted case
		// TODO: handle project submitted case
	}
}
