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
import type {
	CreateLearningPathHandler,
	RemoveLearningPathHandler,
	UpdateLearningPathHandler,
} from '@/app/learning-paths/commands';
import type {
	FindLearningPathByIdHandler,
	ListLearningPathsHandler,
} from '@/app/learning-paths/queries';
import { LearningPathNotFoundException } from '@/app/common';
import { LearningPathCannotBeRemovedException } from '@/domain/learning-paths/exceptions';
import { DiToken } from '@infra/common';
import { ExceptionMessage } from '@infra/common';
import {
	CreateLearningPathBodyDto,
	CreateLearningPathResponseDto,
	FindLearningPathsQueryDto,
	FindLearningPathsResponseDto,
	FindLearningPathByIdResponseDto,
	UpdateLearningPathBodyDto,
	UpdateLearningPathResponseDto,
} from './dtos';
import { clientLearningPathToResponseDto } from './helpers';
import {
	createLearningPathBodySchema,
	findLearningPathsQuerySchema,
	updateLearningPathBodySchema,
} from './schemas';

@Controller({
	path: 'learning-paths',
	version: '1',
})
export class LearningPathsController {
	constructor(
		@Inject(DiToken.LIST_LEARNING_PATHS_HANDLER)
		private readonly listLearningPathsHandler: ListLearningPathsHandler,
		@Inject(DiToken.FIND_LEARNING_PATH_BY_ID_HANDLER)
		private readonly findLearningPathByIdHandler: FindLearningPathByIdHandler,
		@Inject(DiToken.CREATE_LEARNING_PATH_HANDLER)
		private readonly createLearningPathHandler: CreateLearningPathHandler,
		@Inject(DiToken.UPDATE_LEARNING_PATH_HANDLER)
		private readonly updateLearningPathHandler: UpdateLearningPathHandler,
		@Inject(DiToken.REMOVE_LEARNING_PATH_HANDLER)
		private readonly removeLearningPathHandler: RemoveLearningPathHandler,
	) {}

	@ApiQuery({ type: FindLearningPathsQueryDto })
	@ApiOkResponse({ type: FindLearningPathsResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(findLearningPathsQuerySchema))
		query: FindLearningPathsQueryDto,
	): Promise<FindLearningPathsResponseDto> {
		try {
			const result = await this.listLearningPathsHandler.execute({
				options: {
					limit: query.limit,
					page: query.page,
				},
			});

			return {
				paths: result.map(clientLearningPathToResponseDto),
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

	@ApiOkResponse({ type: FindLearningPathByIdResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id')
	async findById(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindLearningPathByIdResponseDto> {
		try {
			const result = await this.findLearningPathByIdHandler.execute({
				where: { id },
			});

			return {
				path: clientLearningPathToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof LearningPathNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.LEARNING_PATH_NOT_FOUND),
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

	@ApiBody({ type: CreateLearningPathBodyDto })
	@ApiCreatedResponse({ type: CreateLearningPathResponseDto })
	@Post()
	async create(
		@Body(new HttpValidationPipe(createLearningPathBodySchema))
		body: CreateLearningPathBodyDto,
	): Promise<CreateLearningPathResponseDto> {
		try {
			const result = await this.createLearningPathHandler.execute({
				name: body.name,
				description: nullToEmptyString(body.description),
			});

			return {
				path: clientLearningPathToResponseDto(result),
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

	@ApiBody({ type: UpdateLearningPathBodyDto })
	@ApiOkResponse({ type: UpdateLearningPathResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateLearningPathBodySchema))
		body: UpdateLearningPathBodyDto,
	): Promise<UpdateLearningPathResponseDto> {
		try {
			const result = await this.updateLearningPathHandler.execute({
				where: { id },
				props: {
					name: body.name,
					description: nullToEmptyString(body.description),
				},
			});

			return {
				path: clientLearningPathToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof LearningPathNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.LEARNING_PATH_NOT_FOUND),
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

	@ApiOkResponse()
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiConflictResponse({ type: HttpErrorResponse })
	@Delete(':id')
	async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
		try {
			await this.removeLearningPathHandler.execute({ where: { id } });
		} catch (err) {
			if (err instanceof LearningPathNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.LEARNING_PATH_NOT_FOUND),
				);
			}

			if (err instanceof LearningPathCannotBeRemovedException) {
				throw new ConflictException(
					new HttpErrorDto(ExceptionMessage.LEARNING_PATH_CANNOT_BE_REMOVED),
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
