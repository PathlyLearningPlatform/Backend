import { ApiProperty } from '@nestjs/swagger'
import { QuizResponseDto } from '../response.dto'

export class FindOneQuizResponseDto {
	@ApiProperty({ type: QuizResponseDto })
	quiz: QuizResponseDto
}
