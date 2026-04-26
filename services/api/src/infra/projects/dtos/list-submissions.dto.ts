import { ProjectSubmissionStatus } from '@/domain/projects';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectApiConstraints } from '../enums';
import { ProjectSubmissionResponseDto } from './response.dto';

export class ListProjectSubmissionsQueryDto {
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

	@ApiPropertyOptional({ enum: ProjectSubmissionStatus })
	status?: ProjectSubmissionStatus;
}

export class ListProjectSubmissionsResponseDto {
	@ApiProperty({ type: [ProjectSubmissionResponseDto] })
	submissions!: ProjectSubmissionResponseDto[];
}
