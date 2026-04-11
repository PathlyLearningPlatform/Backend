import { ApiProperty } from '@nestjs/swagger'
import { QuizResponseDto } from '../response.dto'

export class CreateQuizResponseDto {
	@ApiProperty({ type: QuizResponseDto })
	quiz: QuizResponseDto
}
