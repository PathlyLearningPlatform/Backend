import { ApiProperty } from '@nestjs/swagger'
import { QuizResponseDto } from '../response.dto'

export class UpdateQuizResponseDto {
	@ApiProperty({ type: QuizResponseDto })
	quiz: QuizResponseDto
}
