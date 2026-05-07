import { ArticleResponseDto } from '@/infra/articles/dtos/response.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArticleDto {
	@ApiProperty()
	declare ref: string;

	@ApiProperty()
	declare name: string;

	@ApiPropertyOptional()
	declare description?: string;
}
export class CreateArticleResponseDto {
	@ApiProperty({ type: ArticleResponseDto })
	declare data: ArticleResponseDto;
}

export class UpdateArticleDto {
	@ApiPropertyOptional()
	declare ref?: string;

	@ApiPropertyOptional()
	declare name?: string;

	@ApiPropertyOptional({ nullable: true })
	declare description?: string | null;
}
export class UpdateArticleResponseDto {
	@ApiProperty({ type: ArticleResponseDto })
	declare data: ArticleResponseDto;
}
