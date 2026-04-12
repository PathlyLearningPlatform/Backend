import { ApiPropertyOptional } from '@nestjs/swagger';
import { LearningPathsApiConstraints } from '@infra/learning-paths/enums';

export class ListLearningPathsQueryDto {
	@ApiPropertyOptional({
		type: 'number',
		minimum: LearningPathsApiConstraints.MIN_LIMIT,
		maximum: LearningPathsApiConstraints.MAX_LIMIT,
		default: LearningPathsApiConstraints.DEFAULT_LIMIT,
	})
	limit?: number;

	@ApiPropertyOptional({
		type: 'number',
		minimum: LearningPathsApiConstraints.MIN_LIMIT,
		default: LearningPathsApiConstraints.DEFAULT_PAGE,
	})
	page?: number;
}

export class ListLearningPathProgressQueryDto {
	@ApiPropertyOptional()
	limit?: number;

	@ApiPropertyOptional()
	page?: number;
}
