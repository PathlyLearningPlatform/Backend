import { ApiProperty } from '@nestjs/swagger'
import { LearningPathProgressResponseDto } from '../response.dto'

export class ListLearningPathProgressResponseDto {
	@ApiProperty({ type: [LearningPathProgressResponseDto] })
	learningPathProgress: LearningPathProgressResponseDto[]
}
