import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateActivityDto } from '@infra/activities/dtos/update.dto';
import { ArticleResponseDto } from './response.dto';

export class UpdateArticleDto extends UpdateActivityDto {
	@ApiPropertyOptional()
	ref?: string;
}

export class UpdateArticleResponseDto {
	@ApiProperty({ type: ArticleResponseDto })
	article!: ArticleResponseDto;
}
