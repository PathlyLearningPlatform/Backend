import { ApiProperty } from '@nestjs/swagger'
import { LearningPathResponseDto } from '../response.dto'

export class RemoveLearningPathResponseDto {
	@ApiProperty({ type: LearningPathResponseDto })
	path: LearningPathResponseDto
}
