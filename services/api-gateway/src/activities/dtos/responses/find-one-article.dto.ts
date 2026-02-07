import { ApiProperty } from '@nestjs/swagger'
import { ArticleResponseDto } from '../response.dto'

export class FindOneArticleResponseDto {
	@ApiProperty({ type: ArticleResponseDto })
	article: ArticleResponseDto
}
