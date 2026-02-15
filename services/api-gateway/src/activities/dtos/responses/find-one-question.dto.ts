import { ApiProperty } from '@nestjs/swagger'
import { QuestionResponseDto } from '../response.dto'

export class FindOneQuestionResponseDto {
	@ApiProperty({
		type: QuestionResponseDto,
	})
	question: QuestionResponseDto
}
