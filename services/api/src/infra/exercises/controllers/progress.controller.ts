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
	FindOneExerciseProgressForUserResponseDto,
	ListExerciseProgressQueryDto,
	ListExerciseProgressResponseDto,
} from '../dtos';
import {
	DiToken,
	ExceptionMessage,
	HttpErrorDto,
	HttpValidationPipe,
} from '@/infra/common';
import type {
	FindExerciseProgressForUserHandler,
	ListExerciseProgressHandler,
} from '@/app/exercises';
import { ExerciseProgressNotFoundException } from '@/app/exercises';
import { progressDtoToClient } from '../helpers';
import { listExerciseProgressQuerySchema } from '../schemas/list-progress-query.schema';
import { User } from '@/infra/auth/decorators';
import { JwtGuard } from '@/infra/auth/jwt.guard';
import type { UserInfo } from '@/infra/auth/types';

@UseGuards(JwtGuard)
@Controller({
	path: 'progress/exercises',
	version: '1',
})
export class ExerciseProgressController {
	constructor(
		@Inject(DiToken.LIST_EXERCISE_PROGRESS_HANDLER)
		private readonly listHandler: ListExerciseProgressHandler,
		@Inject(DiToken.FIND_EXERCISE_PROGRESS_FOR_USER_HANDLER)
		private readonly findOneForUserHandler: FindExerciseProgressForUserHandler,
	) {}

	@ApiQuery({ type: ListExerciseProgressQueryDto })
	@ApiOkResponse({ type: ListExerciseProgressResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(listExerciseProgressQuerySchema))
		query: ListExerciseProgressQueryDto,
		@User() user: UserInfo,
	): Promise<ListExerciseProgressResponseDto> {
		try {
			const exerciseProgress = await this.listHandler.execute({
				options: {
					limit: query.limit,
					page: query.page,
				},
				where: {
					status: query.status,
					userId: user.id,
				},
			});

			return {
				data: exerciseProgress.map(progressDtoToClient),
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
	@ApiOkResponse({ type: FindOneExerciseProgressForUserResponseDto })
	@Get(':exerciseId')
	async findOne(
		@Param('exerciseId', ParseUUIDPipe) exerciseId: string,
		@User() user: UserInfo,
	): Promise<FindOneExerciseProgressForUserResponseDto> {
		try {
			const exerciseProgress = await this.findOneForUserHandler.execute({
				exerciseId,
				userId: user.id,
			});

			return {
				data: progressDtoToClient(exerciseProgress),
			};
		} catch (err) {
			if (err instanceof ExerciseProgressNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.EXERCISE_NOT_STARTED),
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
