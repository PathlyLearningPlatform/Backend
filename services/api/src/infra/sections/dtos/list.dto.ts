import { ApiPropertyOptional } from '@nestjs/swagger';
import { SectionsApiConstraints } from '../enums';

export class ListSectionsQueryDto {
	@ApiPropertyOptional({
		type: 'number',
		minimum: SectionsApiConstraints.MIN_LIMIT,
		maximum: SectionsApiConstraints.MAX_LIMIT,
		default: SectionsApiConstraints.DEFAULT_LIMIT,
	})
	limit?: number;

	@ApiPropertyOptional({
		type: 'number',
		minimum: SectionsApiConstraints.MIN_LIMIT,
		default: SectionsApiConstraints.DEFAULT_PAGE,
	})
	page?: number;

	@ApiPropertyOptional()
	learningPathId?: string;
}

export class ListSectionProgressQueryDto {
	@ApiPropertyOptional()
	limit?: number;

	@ApiPropertyOptional()
	page?: number;

	@ApiPropertyOptional()
	learningPathId?: string;
}
