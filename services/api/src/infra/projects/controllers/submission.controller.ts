import {
	Controller,
	Get,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import {
	FindOneProjectSubmissionResponseDto,
	ListProjectSubmissionsQueryDto,
	ListProjectSubmissionsResponseDto,
} from '../dtos';
import {
	DiToken,
	ExceptionMessage,
	HttpErrorDto,
	HttpValidationPipe,
} from '@/infra/common';
import type {
	FindOneProjectSubmissionForUserHandler,
	ListProjectSubmissionsHandler,
} from '@/app/projects';
import { ProjectSubmissionNotFoundException } from '@/app/projects';
import { submissionDtoToClient } from '../helpers';
import { listProjectSubmissionsQuerySchema } from '../schemas/list-submissions-query.schema';
import { User } from '@/infra/auth/decorators';
import { JwtGuard } from '@/infra/auth/jwt.guard';
import type { UserInfo } from '@/infra/auth/types';

@UseGuards(JwtGuard)
@Controller({
	path: 'projects/:project_id/submissions',
	version: '1',
})
export class ProjectSubmissionController {
	constructor(
		@Inject(DiToken.LIST_PROJECT_SUBMISSIONS_HANDLER)
		private readonly listHandler: ListProjectSubmissionsHandler,
		@Inject(DiToken.FIND_ONE_PROJECT_SUBMISSION_FOR_USER_HANDLER)
		private readonly findOneForUserHandler: FindOneProjectSubmissionForUserHandler,
	) {}

	@ApiQuery({ type: ListProjectSubmissionsQueryDto })
	@ApiOkResponse({ type: ListProjectSubmissionsResponseDto })
	@Get()
	async list(
		@Param('project_id', ParseUUIDPipe) projectId: string,
		@Query(new HttpValidationPipe(listProjectSubmissionsQuerySchema))
		query: ListProjectSubmissionsQueryDto,
		@User() user: UserInfo,
	): Promise<ListProjectSubmissionsResponseDto> {
		try {
			const submissions = await this.listHandler.execute({
				options: {
					limit: query.limit,
					page: query.page,
				},
				where: {
					projectId,
					status: query.status,
					userId: user.id,
				},
			});

			return {
				submissions: submissions.map(submissionDtoToClient),
			};
		} catch (err) {
			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{
					cause: err,
				},
			);
		}
	}

	@ApiNotFoundResponse({ type: HttpErrorDto })
	@ApiOkResponse({ type: FindOneProjectSubmissionResponseDto })
	@Get(':id')
	async findOne(
		@Param('project-id', ParseUUIDPipe) projectId: string,
		@Param('id', ParseUUIDPipe) submissionId: string,
		@User() user: UserInfo,
	): Promise<FindOneProjectSubmissionResponseDto> {
		try {
			const submission = await this.findOneForUserHandler.execute({
				projectId,
				submissionId,
				userId: user.id,
			});

			return {
				submission: submissionDtoToClient(submission),
			};
		} catch (err) {
			if (err instanceof ProjectSubmissionNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.PROJECT_SUBMISSION_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{
					cause: err,
				},
			);
		}
	}
}
