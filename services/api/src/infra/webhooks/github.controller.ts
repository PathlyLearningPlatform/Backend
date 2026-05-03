import {
	BadRequestException,
	Body,
	Controller,
	Headers,
	Inject,
	InternalServerErrorException,
	Post,
} from '@nestjs/common';
import { DiToken, HttpErrorDto } from '../common';
import {
	CreateProjectHandler,
	FindProjectByRepoIdHandler,
	FindProjectSubmissionByCommitShaHandler,
	StartProjectHandler,
	SubmitProjectHandler,
	UpdateProjectSubmissionHandler,
} from '@/app/projects';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { GithubWebhookDto } from './dtos/github.dto';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config/types';
import { Octokit } from 'octokit';
import z from 'zod';
import { githubWebhookSchema } from './schemas';
import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { ProjectSubmissionStatus } from '@/domain/projects';
import {
	CreateExerciseHandler,
	FindExerciseByRepoIdHandler,
	FindExerciseSubmissionByCommitShaHandler,
	StartExerciseHandler,
	SubmitExerciseHandler,
	UpdateExerciseSubmissionHandler,
} from '@/app/exercises';
import {
	ExerciseDifficulty,
	ExerciseSubmissionConclusion,
	ExerciseSubmissionStatus,
} from '@/domain/exercises';

@Controller({
	path: 'webhooks/github',
	version: '1',
})
export class GithubWebhookController {
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
		@Inject(DiToken.FIND_PROJECT_BY_REPO_ID)
		private readonly findProjectByRepoIdHandler: FindProjectByRepoIdHandler,
		@Inject(DiToken.UPDATE_PROJECT_SUBMISSION_HANDLER)
		private readonly updateProjectSubmissionHandler: UpdateProjectSubmissionHandler,
		@Inject(DiToken.FIND_PROJECT_SUBMISSION_BY_COMMIT_SHA)
		private readonly findProjectSubmissionByCommitShaHandler: FindProjectSubmissionByCommitShaHandler,
		@Inject(DiToken.CREATE_EXERCISE_HANDLER)
		private readonly createExerciseHandler: CreateExerciseHandler,
		@Inject(DiToken.SUBMIT_EXERCISE_HANDLER)
		private readonly submitExerciseHandler: SubmitExerciseHandler,
		@Inject(DiToken.START_EXERCISE_HANDLER)
		private readonly startExerciseHandler: StartExerciseHandler,
		@Inject(DiToken.FIND_EXERCISE_BY_REPO_ID_HANDLER)
		private readonly findExerciseByRepoIdHandler: FindExerciseByRepoIdHandler,
		@Inject(DiToken.UPDATE_EXERCISE_SUBMISSION_HANDLER)
		private readonly updateExerciseSubmissionHandler: UpdateExerciseSubmissionHandler,
		@Inject(DiToken.FIND_EXERCISE_SUBMISSION_BY_COMMIT_SHA_HANDLER)
		private readonly findExerciseSubmissionByCommitShaHandler: FindExerciseSubmissionByCommitShaHandler,
		@Inject(DiToken.KEYCLOAK_CLIENT)
		private readonly keycloakClient: KeycloakAdminClient,
		@Inject(DiToken.GITHUB_CLIENT)
		private readonly githubClient: Octokit,
	) {
		this.githubConfig = this.configService.get<Config['github']>('github')!;
	}

	@ApiBody({ type: GithubWebhookDto })
	@ApiOkResponse()
	@Post()
	async github(
		@Headers('x-github-event') xGithubEvent: string,
		@Body()
		body: GithubWebhookDto,
	): Promise<void> {
		const temp = body.action;

		body.action = `${xGithubEvent}`;

		if (temp) {
			body.action += `.${temp}`;
		}

		console.log(body.action);

		const modifiedPayload = z.safeParse(githubWebhookSchema, body);

		if (!modifiedPayload.success) {
			throw new BadRequestException(
				new HttpErrorDto('invalid webhook payload'),
				modifiedPayload.error,
			);
		}

		const parsedPayload = modifiedPayload.data;

		try {
			if (parsedPayload.organization.id === this.githubConfig.projectsOrgId) {
				await this.handleProjectEvent(parsedPayload);
			} else if (
				parsedPayload.organization.id === this.githubConfig.exercisesOrgId
			) {
				await this.handleExerciseEvent(parsedPayload);
			}
		} catch (err) {
			throw new InternalServerErrorException(
				new HttpErrorDto('internal server error'),
				{ cause: err },
			);
		}
	}

	private async handleProjectEvent(
		payload: z.infer<typeof githubWebhookSchema>,
	) {
		// project created
		if (payload.action === 'repository.created') {
			await this.createProject(payload);
		}

		// project deleted
		if (payload.action === 'repository.deleted') {
			await this.removeProject(payload);
		}

		// project accepted
		if (payload.action === 'member.added') {
			await this.startProject(payload);
		}

		// project submited
		if (payload.action === 'push') {
			await this.submitProject(payload);
		}

		// submission verified
		if (payload.action === 'check_run.completed') {
			await this.updateProjectSubmission(payload);
		}
	}

	private async handleExerciseEvent(
		payload: z.infer<typeof githubWebhookSchema>,
	) {
		// project created
		if (payload.action === 'repository.created') {
			await this.createExercise(payload);
		}

		// project deleted
		if (payload.action === 'repository.deleted') {
			await this.removeExercise(payload);
		}

		// project accepted
		if (payload.action === 'member.added') {
			await this.startExercise(payload);
		}

		// project submited
		if (payload.action === 'push') {
			await this.submitExercise(payload);
		}

		// submission verified
		if (payload.action === 'check_run.completed') {
			await this.updateExerciseSubmission(payload);
		}
	}

	private async createProject(
		payload: Extract<
			z.infer<typeof githubWebhookSchema>,
			{ action: 'repository.created' }
		>,
	) {
		const repoName = payload.repository.name;
		const assignmentSlug = repoName.split('-')[1];

		console.log(payload);

		const res = await this.githubClient.request(
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
					repositoryId: payload.repository.id,
				});
				break;
			}
		}
	}

	private async removeProject(
		payload: Extract<
			z.infer<typeof githubWebhookSchema>,
			{ action: 'repository.deleted' }
		>,
	) {}

	private async startProject(
		payload: Extract<
			z.infer<typeof githubWebhookSchema>,
			{ action: 'member.added' }
		>,
	) {
		// 1. Skip bot accounts immediately (e.g., github-classroom[bot])
		if (payload.member?.type !== 'User') {
			return;
		}

		const owner = payload.repository.owner.login;
		const repoName = payload.repository.name;

		// 2. Fetch full repository details to check for parent/template relationships
		const { data: repo } = await this.githubClient.rest.repos.get({
			owner,
			repo: repoName,
		});

		// 3. Get the original Assignment (Template/Parent) Repository ID
		// GitHub Classroom uses either template generation or forks.
		const assignmentRepoId = repo.template_repository?.id || repo.parent?.id;

		if (!assignmentRepoId) {
			// This is a standalone repository (not generated from an assignment).
			// Safely ignore it so we only process Classroom assignments.
			return;
		}

		const project = await this.findProjectByRepoIdHandler.execute({
			repositoryId: assignmentRepoId,
		});

		if (!project) {
			// This repo is a fork/template of something else, but not a tracked Project.
			return;
		}

		const ghUserId = payload.member.id.toString();
		const [user] = await this.keycloakClient.users.find({
			idpAlias: 'github',
			idpUserId: ghUserId,
		});

		if (!user || !user.id) {
			// If the user isn't in Keycloak, they might be a teacher, admin, or external.
			// DO NOT throw an exception here, otherwise GitHub will mark the webhook as failed.
			console.warn(
				`User with GitHub ID ${ghUserId} not found in Keycloak. Skipping.`,
			);
			return;
		}

		// 6. Start the Project Progress
		await this.startProjectHandler.execute({
			projectId: project.id,
			repositoryUrl: payload.repository.html_url, // Save the Student's specific repo URL
			userId: user.id,
			repositoryId: payload.repository.id, // Save the Student's specific repo ID
		});
	}

	private async submitProject(
		payload: Extract<z.infer<typeof githubWebhookSchema>, { action: 'push' }>,
	) {
		// only pushes to default branch
		if (
			!payload.ref.startsWith('refs/heads/main') &&
			!payload.ref.startsWith('refs/heads/master')
		) {
			return;
		}

		// ignore branch deletion
		if (payload.deleted) {
			return;
		}

		// ensure there was an actual commit
		if (!payload.head_commit) {
			return;
		}

		const owner = payload.repository.owner.login;
		const repoName = payload.repository.name;

		const repoResponse = await this.githubClient.rest.repos.get({
			owner: owner,
			repo: repoName,
		});

		const repo = repoResponse.data;
		const assignmentRepoId = repo.template_repository?.id || repo.parent?.id;

		// making sure repo is a github classroom repo
		if (!assignmentRepoId) {
			return;
		}

		// handle not found
		const project = await this.findProjectByRepoIdHandler.execute({
			repositoryId: assignmentRepoId,
		});

		const [user] = await this.keycloakClient.users.find({
			idpAlias: 'github',
			idpUserId: payload.sender.id,
		});

		if (!user || !user.id) {
			console.warn(`User with github id ${payload.sender.id} does not exist`);
			return;
		}

		await this.submitProjectHandler.execute({
			projectId: project.id,
			commitSha: payload.head_commit.id,
			userId: user.id,
		});
	}

	private async updateProjectSubmission(
		payload: Extract<
			z.infer<typeof githubWebhookSchema>,
			{ action: 'check_run.completed' }
		>,
	) {
		const { data: repo } = await this.githubClient.rest.repos.get({
			owner: payload.repository.owner.login,
			repo: payload.repository.name,
		});

		if (!repo.parent?.id) {
			return;
		}

		// handle not found
		const project = await this.findProjectByRepoIdHandler.execute({
			repositoryId: repo.parent.id,
		});

		// handle not found
		const submission =
			await this.findProjectSubmissionByCommitShaHandler.execute({
				commitSha: payload.check_run.head_sha,
			});

		const { data: commit } = await this.githubClient.rest.repos.getCommit({
			repo: payload.repository.name,
			owner: payload.repository.owner.login,
			ref: payload.check_run.head_sha,
		});

		if (!commit.author) {
			console.warn(
				`commmit ${commit.sha} of repo ${payload.repository.name} does not have an author`,
			);
			return;
		}

		const [user] = await this.keycloakClient.users.find({
			idpAlias: 'github',
			idpUserId: commit.author.id,
		});

		if (!user || !user.id) {
			console.warn(`User with github id ${commit.author.id} does not exist`);
			return;
		}

		let newStatus: ProjectSubmissionStatus;

		if (payload.check_run.conclusion === 'success') {
			newStatus = ProjectSubmissionStatus.COMPLETED;
		} else if (payload.check_run.conclusion === 'failure') {
			newStatus = ProjectSubmissionStatus.FAILED;
		} else {
			newStatus = ProjectSubmissionStatus.PENDING;
		}

		await this.updateProjectSubmissionHandler.execute({
			where: {
				projectId: project.id,
				submissionId: submission.id,
				userId: user.id,
			},
			fields: {
				status: newStatus,
			},
		});
	}

	private async createExercise(
		payload: Extract<
			z.infer<typeof githubWebhookSchema>,
			{ action: 'repository.created' }
		>,
	) {
		const repoName = payload.repository.name;
		const assignmentSlug = repoName.split('-')[1];

		console.log(payload);

		const res = await this.githubClient.request(
			'GET /classrooms/{classroom_id}/assignments',
			{
				classroom_id: this.githubConfig.exercisesClassroomId,
			},
		);

		for (const assignment of res.data) {
			if (assignment.slug === assignmentSlug) {
				console.log(assignment);
				await this.createExerciseHandler.execute({
					name: assignment.slug,
					acceptUrl: assignment.invite_link,
					repositoryId: payload.repository.id,
					difficulty: ExerciseDifficulty.EASY,
				});
				break;
			}
		}
	}

	private async removeExercise(
		payload: Extract<
			z.infer<typeof githubWebhookSchema>,
			{ action: 'repository.deleted' }
		>,
	) {}

	private async startExercise(
		payload: Extract<
			z.infer<typeof githubWebhookSchema>,
			{ action: 'member.added' }
		>,
	) {
		// 1. Skip bot accounts immediately (e.g., github-classroom[bot])
		if (payload.member?.type !== 'User') {
			return;
		}

		const owner = payload.repository.owner.login;
		const repoName = payload.repository.name;

		// 2. Fetch full repository details to check for parent/template relationships
		const { data: repo } = await this.githubClient.rest.repos.get({
			owner,
			repo: repoName,
		});

		// 3. Get the original Assignment (Template/Parent) Repository ID
		// GitHub Classroom uses either template generation or forks.
		const assignmentRepoId = repo.template_repository?.id || repo.parent?.id;

		if (!assignmentRepoId) {
			// This is a standalone repository (not generated from an assignment).
			// Safely ignore it so we only process Classroom assignments.
			return;
		}

		const exercise = await this.findExerciseByRepoIdHandler.execute({
			repositoryId: assignmentRepoId,
		});

		if (!exercise) {
			// This repo is a fork/template of something else, but not a tracked Project.
			return;
		}

		const ghUserId = payload.member.id.toString();
		const [user] = await this.keycloakClient.users.find({
			idpAlias: 'github',
			idpUserId: ghUserId,
		});

		if (!user || !user.id) {
			// If the user isn't in Keycloak, they might be a teacher, admin, or external.
			// DO NOT throw an exception here, otherwise GitHub will mark the webhook as failed.
			console.warn(
				`User with GitHub ID ${ghUserId} not found in Keycloak. Skipping.`,
			);
			return;
		}

		// 6. Start the Project Progress
		await this.startExerciseHandler.execute({
			exerciseId: exercise.id,
			respositoryUrl: payload.repository.html_url, // Save the Student's specific repo URL
			userId: user.id,
			repositoryId: payload.repository.id, // Save the Student's specific repo ID
		});
	}

	private async submitExercise(
		payload: Extract<z.infer<typeof githubWebhookSchema>, { action: 'push' }>,
	) {
		// only pushes to default branch
		if (
			!payload.ref.startsWith('refs/heads/main') &&
			!payload.ref.startsWith('refs/heads/master')
		) {
			return;
		}

		// ignore branch deletion
		if (payload.deleted) {
			return;
		}

		// ensure there was an actual commit
		if (!payload.head_commit) {
			return;
		}

		const owner = payload.repository.owner.login;
		const repoName = payload.repository.name;

		const repoResponse = await this.githubClient.rest.repos.get({
			owner: owner,
			repo: repoName,
		});

		const repo = repoResponse.data;
		const assignmentRepoId = repo.template_repository?.id || repo.parent?.id;

		// making sure repo is a github classroom repo
		if (!assignmentRepoId) {
			return;
		}

		// handle not found
		const exercise = await this.findExerciseByRepoIdHandler.execute({
			repositoryId: assignmentRepoId,
		});

		const [user] = await this.keycloakClient.users.find({
			idpAlias: 'github',
			idpUserId: payload.sender.id,
		});

		if (!user || !user.id) {
			console.warn(`User with github id ${payload.sender.id} does not exist`);
			return;
		}

		await this.submitExerciseHandler.execute({
			exerciseId: exercise.id,
			commitSha: payload.head_commit.id,
			userId: user.id,
		});
	}

	private async updateExerciseSubmission(
		payload: Extract<
			z.infer<typeof githubWebhookSchema>,
			{ action: 'check_run.completed' }
		>,
	) {
		const { data: repo } = await this.githubClient.rest.repos.get({
			owner: payload.repository.owner.login,
			repo: payload.repository.name,
		});

		if (!repo.parent?.id) {
			return;
		}

		// handle not found
		const project = await this.findExerciseByRepoIdHandler.execute({
			repositoryId: repo.parent.id,
		});

		// handle not found
		const submission =
			await this.findExerciseSubmissionByCommitShaHandler.execute({
				commitSha: payload.check_run.head_sha,
			});

		const { data: commit } = await this.githubClient.rest.repos.getCommit({
			repo: payload.repository.name,
			owner: payload.repository.owner.login,
			ref: payload.check_run.head_sha,
		});

		if (!commit.author) {
			console.warn(
				`commmit ${commit.sha} of repo ${payload.repository.name} does not have an author`,
			);
			return;
		}

		const [user] = await this.keycloakClient.users.find({
			idpAlias: 'github',
			idpUserId: commit.author.id,
		});

		if (!user || !user.id) {
			console.warn(`User with github id ${commit.author.id} does not exist`);
			return;
		}

		let newStatus: ExerciseSubmissionStatus;

		if (payload.check_run.status === 'completed') {
			newStatus = ExerciseSubmissionStatus.COMPLETED;
		} else if (payload.check_run.conclusion === 'failure') {
			newStatus = ExerciseSubmissionStatus.FAILED;
		} else {
			newStatus = ExerciseSubmissionStatus.PENDING;
		}

		let conclusion: ExerciseSubmissionConclusion;

		if (
			payload.check_run.conclusion === 'success' ||
			payload.check_run.conclusion === 'neutral'
		) {
			conclusion = ExerciseSubmissionConclusion.SUCCESS;
		} else if (payload.check_run.conclusion === 'failure') {
			conclusion = ExerciseSubmissionConclusion.FAILED;
		} else {
			conclusion = ExerciseSubmissionConclusion.PENDING;
		}

		await this.updateExerciseSubmissionHandler.execute({
			where: {
				exerciseId: project.id,
				submissionId: submission.id,
				userId: user.id,
			},
			fields: {
				status: newStatus,
				conclusion,
			},
		});
	}
}
