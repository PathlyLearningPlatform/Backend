import { ApiProperty } from '@nestjs/swagger'
import { ArticleResponseDto } from '../response.dto'

export class ArticleResponse {
	@ApiProperty({ type: ArticleResponseDto })
	article: ArticleResponseDto
}
