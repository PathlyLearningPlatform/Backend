import { ApiProperty } from '@nestjs/swagger'
import { LearningPathProgressResponseDto } from '../response.dto'

export class FindLearningPathProgressForUserResponseDto {
	@ApiProperty({ type: LearningPathProgressResponseDto })
	learningPathProgress: LearningPathProgressResponseDto
}
