import { ProjectStatus, ProjectSubmissionStatus } from '@/domain/projects';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectResponseDto {
	@ApiProperty()
	id!: string;

	@ApiProperty()
	repositoryId!: number;

	@ApiProperty()
	name!: string;

	@ApiProperty({ nullable: true })
	description!: string | null;

	@ApiProperty()
	createdAt!: string;

	@ApiProperty({ nullable: true })
	updatedAt!: string | null;

	@ApiProperty()
	acceptUrl!: string;
}

export class ProjectProgressResponseDto {
	@ApiProperty()
	userId!: string;

	@ApiProperty()
	projectId!: string;

	@ApiProperty()
	repositoryId!: number;

	@ApiProperty({ nullable: true })
	completedAt!: string | null;

	@ApiProperty({ nullable: true })
	updatedAt!: string | null;

	@ApiProperty({ enum: ProjectStatus })
	status!: ProjectStatus;

	@ApiProperty()
	repositoryUrl!: string;
}

export class ProjectSubmissionResponseDto {
	@ApiProperty()
	id!: string;

	@ApiProperty()
	projectId!: string;

	@ApiProperty()
	submittedAt!: string;

	@ApiProperty({ nullable: true })
	updatedAt!: string | null;

	@ApiProperty({ enum: ProjectSubmissionStatus })
	status!: ProjectSubmissionStatus;

	@ApiProperty()
	userId!: string;
}
