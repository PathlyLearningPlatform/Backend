import { ApiProperty } from '@nestjs/swagger'

export class CreateQuestionDto {
	@ApiProperty()
	content: string

	@ApiProperty()
	correctAnswer: string
}
