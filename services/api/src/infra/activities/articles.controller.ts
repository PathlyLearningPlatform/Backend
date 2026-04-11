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
import { HttpErrorResponse } from '@infra/swagger';
import {
	HttpErrorDto,
	HttpValidationPipe,
	nullToEmptyString,
} from '@infra/common';
import type { UpdateArticleHandler } from '@/app/activities/commands';
import type { FindArticleByIdHandler } from '@/app/activities/queries';
import {
	ActivityNotFoundException,
	LessonNotFoundException,
} from '@/app/common';
import type { AddArticleHandler } from '@/app/lessons/commands';
import { DiToken } from '@infra/common';
import { ExceptionMessage } from '@infra/common';
import { CreateArticleDto, UpdateArticleDto } from './dtos';
import {
	CreateArticleResponseDto,
	FindArticleByIdResponseDto,
	UpdateArticleResponseDto,
} from './dtos/responses';
import { clientArticleToResponseDto } from './helpers';
import { createArticleSchema, updateArticlePropsSchema } from './schemas';

@Controller({
	path: 'articles',
	version: '1',
})
export class ArticlesController {
	constructor(
		@Inject(DiToken.FIND_ARTICLE_BY_ID_HANDLER)
		private readonly findArticleByIdHandler: FindArticleByIdHandler,
		@Inject(DiToken.ADD_ARTICLE_HANDLER)
		private readonly addArticleHandler: AddArticleHandler,
		@Inject(DiToken.UPDATE_ARTICLE_HANDLER)
		private readonly updateArticleHandler: UpdateArticleHandler,
	) {}

	@ApiOkResponse({ type: FindArticleByIdResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id')
	async findById(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindArticleByIdResponseDto> {
		try {
			const result = await this.findArticleByIdHandler.execute({
				where: { id },
			});

			return {
				article: clientArticleToResponseDto(result),
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

	@ApiBody({ type: CreateArticleDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiCreatedResponse({ type: CreateArticleResponseDto })
	@Post()
	async create(
		@Body(new HttpValidationPipe(createArticleSchema))
		body: CreateArticleDto,
	): Promise<CreateArticleResponseDto> {
		try {
			const result = await this.addArticleHandler.execute({
				name: body.name,
				description: nullToEmptyString(body.description),
				lessonId: body.lessonId,
				ref: body.ref,
			});

			return {
				article: clientArticleToResponseDto(result),
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

	@ApiBody({ type: UpdateArticleDto })
	@ApiOkResponse({ type: UpdateArticleResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateArticlePropsSchema))
		body: UpdateArticleDto,
	): Promise<UpdateArticleResponseDto> {
		try {
			const result = await this.updateArticleHandler.execute({
				where: { id },
				props: {
					name: body.name,
					description: nullToEmptyString(body.description),
					ref: body.ref,
				},
			});

			return {
				article: clientArticleToResponseDto(result),
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
