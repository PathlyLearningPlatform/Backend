import { ApiProperty } from '@nestjs/swagger'
import { QuestionResponseDto } from '../response.dto'

export class FindQuestionsResponseDto {
	@ApiProperty({
		type: [QuestionResponseDto],
	})
	questions: QuestionResponseDto[]
}
