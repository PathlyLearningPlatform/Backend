import { ApiPropertyOptional } from '@nestjs/swagger';
import { LessonsApiConstraints } from '../enums';

export class ListLessonsQueryDto {
	@ApiPropertyOptional({
		type: 'number',
		minimum: LessonsApiConstraints.MIN_LIMIT,
		maximum: LessonsApiConstraints.MAX_LIMIT,
		default: LessonsApiConstraints.DEFAULT_LIMIT,
	})
	limit?: number;

	@ApiPropertyOptional({
		type: 'number',
		minimum: LessonsApiConstraints.MIN_LIMIT,
		default: LessonsApiConstraints.DEFAULT_PAGE,
	})
	page?: number;
}

export class ListLessonProgressQueryDto {
	@ApiPropertyOptional()
	limit?: number;

	@ApiPropertyOptional()
	page?: number;
}
