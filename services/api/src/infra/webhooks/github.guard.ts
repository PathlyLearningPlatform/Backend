import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config/types';
import { HttpErrorDto } from '../common';

@Injectable()
export class GithubWebhookGuard implements CanActivate {
	private readonly githubConfig: Config['github'];

	constructor(private readonly configService: ConfigService) {
		this.githubConfig = configService.get<Config['github']>('github')!;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();

		const hash = request.get('X-Hub-Signature-256');

		if (!hash) {
			throw new BadRequestException(
				new HttpErrorDto('Missing X-Hub-Signature-256 header'),
			);
		}

		if (!this.githubConfig.appWebhookSecret) {
			throw new InternalServerErrorException(
				new HttpErrorDto('Internal server error'),
				{ cause: 'Cannot verify webhook payload because secret is missing' },
			);
		}

		const { verify } = await import('@octokit/webhooks-methods');

		const valid = await verify(
			this.githubConfig.appWebhookSecret || '',
			JSON.stringify(request.body),
			hash,
		);

		if (!valid) {
			throw new ForbiddenException(new HttpErrorDto('Invalid signature'));
		}

		return true;
	}
}
