import { ApiProperty } from '@nestjs/swagger'
import { ArticleResponseDto } from '../response.dto'

export class CreateArticleResponseDto {
	@ApiProperty({ type: ArticleResponseDto })
	article: ArticleResponseDto
}
