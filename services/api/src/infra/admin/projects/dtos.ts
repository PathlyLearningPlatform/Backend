import { ProjectResponseDto } from '@/infra/projects/dtos';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
	@ApiProperty()
	acceptUrl!: string;

	@ApiProperty()
	name!: string;

	@ApiProperty()
	repositoryId!: number;

	@ApiPropertyOptional()
	description?: string;
}
export class CreateProjectResponseDto {
	@ApiProperty({ type: ProjectResponseDto })
	data!: ProjectResponseDto;
}

export class UpdateProjectDto {
	@ApiPropertyOptional()
	name?: string;

	@ApiPropertyOptional({ nullable: true })
	description?: string | null;
}
export class UpdateProjectResponseDto {
	@ApiProperty({ type: ProjectResponseDto })
	data!: ProjectResponseDto;
}
