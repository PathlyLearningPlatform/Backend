import { ApiProperty } from '@nestjs/swagger'
import { ArticleResponseDto } from '../response.dto'

export class UpdateArticleResponseDto {
	@ApiProperty({ type: ArticleResponseDto })
	article: ArticleResponseDto
}
