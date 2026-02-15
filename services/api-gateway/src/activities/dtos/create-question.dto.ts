import { ApiProperty } from '@nestjs/swagger'

export class CreateQuestionDto {
	@ApiProperty()
	quizId: string

	@ApiProperty()
	content: string

	@ApiProperty()
	correctAnswer: string
}
