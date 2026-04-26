import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectResponseDto } from './response.dto';
import { ProjectApiConstraints } from '../enums';

export class ListProjectsDto {
	@ApiPropertyOptional({
		type: 'number',
		minimum: 1,
		default: ProjectApiConstraints.DEFAULT_LIMIT,
	})
	limit?: number;

	@ApiPropertyOptional({
		type: 'number',
		minimum: 0,
		default: ProjectApiConstraints.DEFAULT_PAGE,
	})
	page?: number;
}

export class ListProjectsResponseDto {
	@ApiProperty({ type: [ProjectResponseDto] })
	projects!: ProjectResponseDto[];
}
