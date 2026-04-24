import {
	Body,
	Controller,
	Get,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
} from '@nestjs/common';
import {
	ApiBody,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
} from '@nestjs/swagger';
import { HttpErrorDto, HttpValidationPipe } from '@infra/common';
import type {
	FindExerciseByIdHandler,
	UpdateExerciseHandler,
	CreateExerciseHandler,
} from '@/app/exercises';
import {
	ActivityNotFoundException,
	LessonNotFoundException,
} from '@/app/common';
import { DiToken } from '@infra/common';
import { ExceptionMessage } from '@infra/common';
import {
	CreateExerciseDto,
	CreateExerciseResponseDto,
	FindExerciseByIdResponseDto,
	UpdateExerciseDto,
	UpdateExerciseResponseDto,
} from './dtos';
import { clientExerciseToResponseDto } from './helpers';
import { createExerciseSchema, updateExercisePropsSchema } from './schemas';

@Controller({
	path: 'exercises',
	version: '1',
})
export class ExercisesController {
	constructor(
		@Inject(DiToken.FIND_EXERCISE_BY_ID_HANDLER)
		private readonly findExerciseByIdHandler: FindExerciseByIdHandler,
		@Inject(DiToken.CREATE_EXERCISE_HANDLER)
		private readonly createExerciseHandler: CreateExerciseHandler,
		@Inject(DiToken.UPDATE_EXERCISE_HANDLER)
		private readonly updateExerciseHandler: UpdateExerciseHandler,
	) {}

	@ApiOkResponse({ type: FindExerciseByIdResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Get(':id')
	async findById(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindExerciseByIdResponseDto> {
		try {
			const result = await this.findExerciseByIdHandler.execute({
				where: { id },
			});

			return {
				exercise: clientExerciseToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.ACTIVITY_NOT_FOUND),
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

	@ApiBody({ type: CreateExerciseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@ApiCreatedResponse({ type: CreateExerciseResponseDto })
	@Post()
	async create(
		@Body(new HttpValidationPipe(createExerciseSchema))
		body: CreateExerciseDto,
	): Promise<CreateExerciseResponseDto> {
		try {
			const result = await this.createExerciseHandler.execute({
				name: body.name,
				description: body.description,
				lessonId: body.lessonId,
				difficulty: body.difficulty,
			});

			return {
				exercise: clientExerciseToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.LESSON_NOT_FOUND),
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

	@ApiBody({ type: UpdateExerciseDto })
	@ApiOkResponse({ type: UpdateExerciseResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateExercisePropsSchema))
		body: UpdateExerciseDto,
	): Promise<UpdateExerciseResponseDto> {
		try {
			const result = await this.updateExerciseHandler.execute({
				where: { id },
				props: {
					name: body.name,
					description: body.description,
					difficulty: body.difficulty,
				},
			});

			return {
				exercise: clientExerciseToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.ACTIVITY_NOT_FOUND),
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
