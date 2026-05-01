import {
	ProjectDto,
	ProjectProgressDto,
	ProjectSubmissionDto,
} from '@/app/projects';
import {
	ProjectProgressResponseDto,
	ProjectResponseDto,
	ProjectSubmissionResponseDto,
} from './dtos';

export function dtoToClient(dto: ProjectDto): ProjectResponseDto {
	return {
		id: dto.id,
		acceptUrl: dto.acceptUrl,
		createdAt: dto.createdAt.toISOString(),
		description: dto.description,
		name: dto.name,
		updatedAt: dto.updatedAt ? dto.updatedAt.toISOString() : null,
		repositoryId: dto.repositoryId,
	};
}

export function progressDtoToClient(
	dto: ProjectProgressDto,
): ProjectProgressResponseDto {
	return {
		completedAt: dto.completedAt ? dto.completedAt.toISOString() : null,
		projectId: dto.projectId,
		repositoryUrl: dto.repositoryUrl,
		status: dto.status,
		updatedAt: dto.updatedAt ? dto.updatedAt.toISOString() : null,
		userId: dto.userId,
		repositoryId: dto.repositoryId,
	};
}

export function submissionDtoToClient(
	dto: ProjectSubmissionDto,
): ProjectSubmissionResponseDto {
	return {
		id: dto.id,
		projectId: dto.projectId,
		status: dto.status,
		submittedAt: dto.submittedAt.toISOString(),
		updatedAt: dto.updatedAt ? dto.updatedAt.toISOString() : null,
		userId: dto.userId,
	};
}
