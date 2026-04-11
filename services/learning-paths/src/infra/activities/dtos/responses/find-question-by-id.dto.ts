import { ApiProperty } from '@nestjs/swagger'
import { QuestionResponseDto } from '../response.dto'

export class FindQuestionByIdResponseDto {
	@ApiProperty({
		type: QuestionResponseDto,
	})
	question: QuestionResponseDto
}
