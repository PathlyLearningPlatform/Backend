import { ApiProperty } from '@nestjs/swagger'
import { QuestionResponseDto } from '../response.dto'

export class UpdateQuestionResponseDto {
	@ApiProperty({
		type: QuestionResponseDto,
	})
	question: QuestionResponseDto
}
