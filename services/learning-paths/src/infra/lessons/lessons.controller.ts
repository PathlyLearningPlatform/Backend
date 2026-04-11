import {
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import {
	ApiBody,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiQuery,
} from '@nestjs/swagger';
import { HttpErrorResponse } from '@infra/swagger';
import {
	HttpErrorDto,
	HttpValidationPipe,
	nullToEmptyString,
} from '@infra/common';
import { LessonNotFoundException, UnitNotFoundException } from '@/app/common';
import type {
	RemoveLessonHandler,
	UpdateLessonHandler,
} from '@/app/lessons/commands';
import type {
	FindLessonByIdHandler,
	ListLessonsHandler,
} from '@/app/lessons/queries';
import type { AddLessonHandler } from '@/app/units/commands';
import { LessonCannotBeRemovedException } from '@/domain/lessons/exceptions';
import { DiToken } from '@infra/common';
import { ExceptionMessage } from '@infra/common';
import {
	CreateLessonBodyDto,
	CreateLessonResponseDto,
	FindLessonsQueryDto,
	FindLessonsResponseDto,
	FindLessonByIdResponseDto,
	UpdateLessonBodyDto,
	UpdateLessonResponseDto,
} from './dtos';
import { clientLessonToResponseDto } from './helpers';
import {
	createLessonBodySchema,
	findLessonsQuerySchema,
	updateLessonBodySchema,
} from './schemas';

@Controller({
	path: 'lessons',
	version: '1',
})
export class LessonsController {
	constructor(
		@Inject(DiToken.LIST_LESSONS_HANDLER)
		private readonly listLessonsHandler: ListLessonsHandler,
		@Inject(DiToken.FIND_LESSON_BY_ID_HANDLER)
		private readonly findLessonByIdHandler: FindLessonByIdHandler,
		@Inject(DiToken.ADD_LESSON_HANDLER)
		private readonly addLessonHandler: AddLessonHandler,
		@Inject(DiToken.UPDATE_LESSON_HANDLER)
		private readonly updateLessonHandler: UpdateLessonHandler,
		@Inject(DiToken.REMOVE_LESSON_HANDLER)
		private readonly removeLessonHandler: RemoveLessonHandler,
	) {}

	@ApiQuery({ type: FindLessonsQueryDto })
	@ApiOkResponse({ type: FindLessonsResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(findLessonsQuerySchema))
		query: FindLessonsQueryDto,
	): Promise<FindLessonsResponseDto> {
		try {
			const result = await this.listLessonsHandler.execute({
				options: query,
			});

			return {
				lessons: result.map(clientLessonToResponseDto),
			};
		} catch (err) {
			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}

	@ApiOkResponse({ type: FindLessonByIdResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id')
	async findById(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindLessonByIdResponseDto> {
		try {
			const result = await this.findLessonByIdHandler.execute({
				where: { id },
			});

			return {
				lesson: clientLessonToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.LESSON_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}

	@ApiBody({ type: CreateLessonBodyDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiConflictResponse({ type: HttpErrorResponse })
	@ApiCreatedResponse({ type: CreateLessonResponseDto })
	@Post()
	async create(
		@Body(new HttpValidationPipe(createLessonBodySchema))
		body: CreateLessonBodyDto,
	): Promise<CreateLessonResponseDto> {
		try {
			const result = await this.addLessonHandler.execute({
				name: body.name,
				description: nullToEmptyString(body.description),
				unitId: body.unitId,
			});

			return {
				lesson: clientLessonToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof UnitNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.UNIT_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}

	@ApiBody({ type: UpdateLessonBodyDto })
	@ApiOkResponse({ type: UpdateLessonResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiConflictResponse({ type: HttpErrorResponse })
	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateLessonBodySchema))
		body: UpdateLessonBodyDto,
	): Promise<UpdateLessonResponseDto> {
		try {
			const result = await this.updateLessonHandler.execute({
				where: { id },
				props: {
					name: body.name,
					description: nullToEmptyString(body.description),
				},
			});

			return {
				lesson: clientLessonToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.LESSON_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}

	@ApiOkResponse()
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiConflictResponse({ type: HttpErrorResponse })
	@Delete(':id')
	async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
		try {
			await this.removeLessonHandler.execute({
				lessonId: id,
			});
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.LESSON_NOT_FOUND),
				);
			}

			if (err instanceof LessonCannotBeRemovedException) {
				throw new ConflictException(
					new HttpErrorDto(ExceptionMessage.LESSON_CANNOT_BE_REMOVED),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}
}
