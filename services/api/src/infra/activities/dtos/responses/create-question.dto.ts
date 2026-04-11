import { ApiProperty } from '@nestjs/swagger'
import { QuestionResponseDto } from '../response.dto'

export class CreateQuestionResponseDto {
	@ApiProperty({
		type: QuestionResponseDto,
	})
	question: QuestionResponseDto
}
