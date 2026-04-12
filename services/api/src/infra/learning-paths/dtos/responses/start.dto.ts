import { ApiProperty } from '@nestjs/swagger'
import { LearningPathProgressResponseDto } from '../response.dto'

export class StartLearningPathResponseDto {
	@ApiProperty({ type: LearningPathProgressResponseDto })
	learningPathProgress: LearningPathProgressResponseDto
}
