import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArticleResponseDto } from './response.dto';

export class ListArticlesDto {
	@ApiPropertyOptional()
	limit?: number;

	@ApiPropertyOptional()
	page?: number;
}

export class ListArticlesResponseDto {
	@ApiProperty({ type: [ArticleResponseDto] })
	declare data: ArticleResponseDto[];
}
