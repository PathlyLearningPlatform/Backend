import { ApiProperty } from '@nestjs/swagger'
import { LearningPathResponseDto } from '../response.dto'

export class FindLearningPathByIdResponseDto {
	@ApiProperty({ type: LearningPathResponseDto })
	path: LearningPathResponseDto
}
