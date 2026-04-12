import { ApiProperty } from '@nestjs/swagger';
import { LearningPathResponseDto } from '../response.dto';

export class ListLearningPathsResponseDto {
	@ApiProperty({ type: [LearningPathResponseDto] })
	paths: LearningPathResponseDto[];
}
