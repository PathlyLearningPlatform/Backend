import { ApiProperty } from '@nestjs/swagger'
import { LearningPathResponseDto } from '../response.dto'

export class FindOneLearningPathResponseDto {
	@ApiProperty({ type: LearningPathResponseDto })
	path: LearningPathResponseDto
}
