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
import type { UpdateExerciseHandler } from '@/app/activities/commands';
import type { FindExerciseByIdHandler } from '@/app/activities/queries';
import {
	ActivityNotFoundException,
	LessonNotFoundException,
} from '@/app/common';
import type { AddExerciseHandler } from '@/app/lessons/commands';
import { ExerciseDifficulty as DomainExerciseDifficulty } from '@/domain/exercises/value-objects';
import { DiToken } from '@infra/common';
import { ExceptionMessage } from '@infra/common';
import { CreateExerciseDto, UpdateExerciseDto } from './dtos';
import {
	CreateExerciseResponseDto,
	FindExerciseByIdResponseDto,
	UpdateExerciseResponseDto,
} from './dtos/responses';
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
		@Inject(DiToken.ADD_EXERCISE_HANDLER)
		private readonly addExerciseHandler: AddExerciseHandler,
		@Inject(DiToken.UPDATE_EXERCISE_HANDLER)
		private readonly updateExerciseHandler: UpdateExerciseHandler,
	) {}

	private toDomainDifficulty(
		difficulty: unknown,
	): DomainExerciseDifficulty | undefined {
		if (difficulty === undefined) {
			return undefined;
		}

		if (
			difficulty === DomainExerciseDifficulty.EASY ||
			difficulty === DomainExerciseDifficulty.MEDIUM ||
			difficulty === DomainExerciseDifficulty.HARD
		) {
			return difficulty as DomainExerciseDifficulty;
		}

		return undefined;
	}

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
			const difficulty = this.toDomainDifficulty(body.difficulty);

			if (!difficulty) {
				throw new InternalServerErrorException(
					new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				);
			}

			const result = await this.addExerciseHandler.execute({
				name: body.name,
				description: body.description,
				lessonId: body.lessonId,
				difficulty,
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
					difficulty: this.toDomainDifficulty(body.difficulty),
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
