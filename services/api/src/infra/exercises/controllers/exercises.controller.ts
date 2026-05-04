import {
	Controller,
	Get,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Query,
} from '@nestjs/common';
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';
import {
	FindExerciseByIdResponseDto,
	ListExercisesDto,
	ListExercisesResponseDto,
} from '../dtos';
import { dtoToClient } from '../helpers';
import { listExercisesQuerySchema } from '../schemas/list-query.schema';
import {
	DiToken,
	ExceptionMessage,
	HttpErrorDto,
	HttpValidationPipe,
} from '@/infra/common';
import type {
	FindExerciseByIdHandler,
	ListExercisesHandler,
} from '@/app/exercises';
import { ExerciseNotFoundException } from '@/app/exercises';

@ApiTags('exercises')
@Controller({
	path: 'exercises',
	version: '1',
})
export class ExerciseController {
	constructor(
		@Inject(DiToken.LIST_EXERCISES_HANDLER)
		private readonly listHandler: ListExercisesHandler,
		@Inject(DiToken.FIND_EXERCISE_BY_ID_HANDLER)
		private readonly findByIdHandler: FindExerciseByIdHandler,
	) {}

	@ApiQuery({ type: ListExercisesDto })
	@ApiOkResponse({ type: ListExercisesResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(listExercisesQuerySchema))
		query: ListExercisesDto,
	): Promise<ListExercisesResponseDto> {
		try {
			const exercises = await this.listHandler.execute({
				options: {
					limit: query.limit,
					page: query.page,
				},
			});

			return {
				data: exercises.map(dtoToClient),
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

	@ApiOkResponse({ type: FindExerciseByIdResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Get(':id')
	async findById(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindExerciseByIdResponseDto> {
		try {
			const exercise = await this.findByIdHandler.execute({ where: { id } });

			return {
				data: dtoToClient(exercise),
			};
		} catch (err) {
			if (err instanceof ExerciseNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.EXERCISE_NOT_FOUND),
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
