import { ApiProperty } from '@nestjs/swagger'
import { ArticleResponseDto } from '../response.dto'

export class FindArticleByIdResponseDto {
	@ApiProperty({ type: ArticleResponseDto })
	article: ArticleResponseDto
}
