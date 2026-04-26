import { ProjectStatus } from '@/domain/projects';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectApiConstraints } from '../enums';
import { ProjectProgressResponseDto } from './response.dto';

export class ListProjectProgressQueryDto {
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

	@ApiPropertyOptional({ enum: ProjectStatus })
	status?: ProjectStatus;
}

export class ListProjectProgressResponseDto {
	@ApiProperty({ type: [ProjectProgressResponseDto] })
	projectProgress!: ProjectProgressResponseDto[];
}
