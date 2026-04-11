import { ApiProperty } from '@nestjs/swagger'
import { LearningPathResponseDto } from '../response.dto'

export class CreateLearningPathResponseDto {
	@ApiProperty({ type: LearningPathResponseDto })
	path: LearningPathResponseDto
}
