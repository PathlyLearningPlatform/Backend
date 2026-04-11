import { ApiProperty } from '@nestjs/swagger'
import { LearningPathResponseDto } from '../response.dto'

export class FindLearningPathsResponseDto {
	@ApiProperty({ type: [LearningPathResponseDto] })
	paths: LearningPathResponseDto[]
}
