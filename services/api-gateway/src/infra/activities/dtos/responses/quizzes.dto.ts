import { ApiProperty } from '@nestjs/swagger'
import { QuizResponseDto } from '../response.dto'

export class QuizzesResponse {
	@ApiProperty({ type: [QuizResponseDto] })
	quizzes: QuizResponseDto[]
}
