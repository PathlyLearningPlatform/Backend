import {
	CreateArticleHandler,
	RemoveArticleHandler,
	UpdateArticleHandler,
} from '@/app/articles';
import {
	DiToken,
	ExceptionMessage,
	HttpErrorDto,
	HttpValidationPipe,
} from '@/infra/common';
import {
	Body,
	Controller,
	Delete,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
	CreateArticleDto,
	CreateArticleResponseDto,
	UpdateArticleDto,
	UpdateArticleResponseDto,
} from './dtos';
import { createArticleSchema, updateArticleSchema } from './schemas';
import { clientArticleToResponseDto } from '@/infra/articles/helpers';
import { ArticleNotFoundException } from '@/app/common';

@ApiTags('admin/articles')
@Controller({
	path: 'articles',
	version: '1',
})
export class ArticleAdminController {
	constructor(
		@Inject(DiToken.CREATE_ARTICLE_HANDLER)
		private readonly createHandler: CreateArticleHandler,
		@Inject(DiToken.UPDATE_ARTICLE_HANDLER)
		private readonly updateHandler: UpdateArticleHandler,
		@Inject(DiToken.REMOVE_ARTICLE_HANDLER)
		private readonly removeHandler: RemoveArticleHandler,
	) {}

	@ApiOkResponse({ type: CreateArticleResponseDto })
	@Post()
	async create(
		@Body(new HttpValidationPipe(createArticleSchema)) body: CreateArticleDto,
	): Promise<CreateArticleResponseDto> {
		try {
			const article = await this.createHandler.execute({
				name: body.name,
				ref: body.ref,
				description: body.description,
			});

			return { data: clientArticleToResponseDto(article) };
		} catch (err) {
			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}

	@ApiOkResponse({ type: UpdateArticleResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateArticleSchema)) body: UpdateArticleDto,
	): Promise<UpdateArticleResponseDto> {
		try {
			const article = await this.updateHandler.execute({
				where: { id },
				props: body,
			});

			return { data: clientArticleToResponseDto(article) };
		} catch (err) {
			if (err instanceof ArticleNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.ARTICLE_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}

	@ApiOkResponse()
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Delete(':id')
	async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
		try {
			await this.removeHandler.execute({
				id,
			});
		} catch (err) {
			if (err instanceof ArticleNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.ARTICLE_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}
}
