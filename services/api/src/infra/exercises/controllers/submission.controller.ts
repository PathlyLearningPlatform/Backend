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
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';
import {
	FindOneExerciseSubmissionResponseDto,
	ListExerciseSubmissionsQueryDto,
	ListExerciseSubmissionsResponseDto,
} from '../dtos';
import {
	DiToken,
	ExceptionMessage,
	HttpErrorDto,
	HttpValidationPipe,
} from '@/infra/common';
import type {
	FindExerciseSubmissionForUserHandler,
	ListExerciseSubmissionsHandler,
} from '@/app/exercises';
import { ExerciseSubmissionNotFoundException } from '@/app/exercises';
import { submissionDtoToClient } from '../helpers';
import { listExerciseSubmissionsQuerySchema } from '../schemas/list-submissions-query.schema';
import { User } from '@/infra/auth/decorators';
import { JwtGuard } from '@/infra/auth/jwt.guard';
import type { UserInfo } from '@/infra/auth/types';

@ApiTags('progress/exercises/submissions')
@UseGuards(JwtGuard)
@Controller({
	path: 'exercises/:exercise_id/submissions',
	version: '1',
})
export class ExerciseSubmissionController {
	constructor(
		@Inject(DiToken.LIST_EXERCISE_SUBMISSIONS_HANDLER)
		private readonly listHandler: ListExerciseSubmissionsHandler,
		@Inject(DiToken.FIND_EXERCISE_SUBMISSION_FOR_USER_HANDLER)
		private readonly findOneForUserHandler: FindExerciseSubmissionForUserHandler,
	) {}

	@ApiQuery({ type: ListExerciseSubmissionsQueryDto })
	@ApiOkResponse({ type: ListExerciseSubmissionsResponseDto })
	@Get()
	async list(
		@Param('exercise_id', ParseUUIDPipe) exerciseId: string,
		@Query(new HttpValidationPipe(listExerciseSubmissionsQuerySchema))
		query: ListExerciseSubmissionsQueryDto,
		@User() user: UserInfo,
	): Promise<ListExerciseSubmissionsResponseDto> {
		try {
			const submissions = await this.listHandler.execute({
				options: {
					limit: query.limit,
					page: query.page,
				},
				where: {
					exerciseId,
					status: query.status,
					userId: user.id,
				},
			});

			return {
				data: submissions.map(submissionDtoToClient),
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
	@ApiOkResponse({ type: FindOneExerciseSubmissionResponseDto })
	@Get(':id')
	async findOne(
		@Param('exercise-id', ParseUUIDPipe) exerciseId: string,
		@Param('id', ParseUUIDPipe) submissionId: string,
		@User() user: UserInfo,
	): Promise<FindOneExerciseSubmissionResponseDto> {
		try {
			const submission = await this.findOneForUserHandler.execute({
				exerciseId,
				submissionId,
				userId: user.id,
			});

			return {
				data: submissionDtoToClient(submission),
			};
		} catch (err) {
			if (err instanceof ExerciseSubmissionNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.EXERCISE_SUBMISSION_NOT_FOUND),
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
