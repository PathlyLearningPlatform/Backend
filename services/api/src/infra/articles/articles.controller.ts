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
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HttpErrorDto, HttpValidationPipe } from '@infra/common';
import type {
	FindArticleByIdHandler,
	ListArticlesHandler,
} from '@/app/articles';
import { ArticleNotFoundException } from '@/app/common';
import { DiToken } from '@infra/common';
import { ExceptionMessage } from '@infra/common';
import {
	FindArticleByIdResponseDto,
	ListArticlesDto,
	ListArticlesResponseDto,
} from './dtos';
import { clientArticleToResponseDto } from './helpers';
import { listArticlesSchema } from './schemas';

@ApiTags('articles')
@Controller({
	path: 'articles',
	version: '1',
})
export class ArticlesController {
	constructor(
		@Inject(DiToken.FIND_ARTICLE_BY_ID_HANDLER)
		private readonly findByIdHandler: FindArticleByIdHandler,
		@Inject(DiToken.LIST_ARTICLES_HANDLER)
		private readonly listHandler: ListArticlesHandler,
	) {}

	@ApiOkResponse({ type: ListArticlesResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(listArticlesSchema)) query: ListArticlesDto,
	): Promise<ListArticlesResponseDto> {
		try {
			const articles = await this.listHandler.execute({
				options: {
					limit: query.limit,
					page: query.page,
				},
			});

			return { data: articles.map(clientArticleToResponseDto) };
		} catch (err) {
			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{
					cause: err,
				},
			);
		}
	}

	@ApiOkResponse({ type: FindArticleByIdResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Get(':id')
	async findById(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindArticleByIdResponseDto> {
		try {
			const result = await this.findByIdHandler.execute({
				where: { id },
			});

			return {
				article: clientArticleToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof ArticleNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.ARTICLE_NOT_FOUND),
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
