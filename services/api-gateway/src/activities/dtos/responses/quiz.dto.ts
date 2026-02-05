import { ApiProperty } from '@nestjs/swagger'
import { QuizResponseDto } from '../response.dto'

export class QuizResponse {
	@ApiProperty({ type: QuizResponseDto })
	quiz: QuizResponseDto
}
