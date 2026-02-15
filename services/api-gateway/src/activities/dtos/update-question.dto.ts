import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateQuestionDto {
	@ApiPropertyOptional()
	content?: string

	@ApiPropertyOptional()
	correctAnswer?: string
}
