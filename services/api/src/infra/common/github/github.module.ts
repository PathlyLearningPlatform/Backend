import { Module } from '@nestjs/common';
import { DiToken } from '../enums';
import { ConfigService } from '@nestjs/config';
import { Config } from '@/infra/config/types';
import { ConfigException } from '../exceptions';
import { Octokit } from 'octokit';

@Module({
	imports: [],
	providers: [
		{
			provide: DiToken.GITHUB_CLIENT,
			async useFactory(configService: ConfigService) {
				const githubConfig = configService.get<Config['github']>('github');

				if (!githubConfig) {
					throw new ConfigException('failed to load github configuration');
				}

				const octokit = new Octokit({
					auth: githubConfig.projectsClassroomPAT,
				});

				return octokit;
			},
			inject: [ConfigService],
		},
	],
	exports: [DiToken.GITHUB_CLIENT],
})
export class GithubModule {}
