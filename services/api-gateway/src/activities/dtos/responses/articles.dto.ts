import { ApiProperty } from '@nestjs/swagger'
import { ArticleResponseDto } from '../response.dto'

export class ArticlesResponse {
	@ApiProperty({ type: [ArticleResponseDto] })
	articles: ArticleResponseDto[]
}
