import { Project, ProjectProgress, ProjectSubmission } from '@/domain/projects';
import { ProjectDto, ProjectProgressDto, ProjectSubmissionDto } from './dtos';

export function aggregateToDto(aggregate: Project): ProjectDto {
	return {
		id: aggregate.id.value,
		name: aggregate.name,
		description: aggregate.description,
		createdAt: aggregate.createdAt,
		updatedAt: aggregate.updatedAt,
		acceptUrl: aggregate.acceptUrl.value,
		repositoryId: aggregate.repositoryId.value,
	};
}

export function submissionAggregateToDto(
	aggregate: ProjectSubmission,
): ProjectSubmissionDto {
	return {
		id: aggregate.id.value,
		projectId: aggregate.projectId.value,
		status: aggregate.status,
		submittedAt: aggregate.submittedAt,
		updatedAt: aggregate.updatedAt,
		userId: aggregate.userId.toString(),
		commitSha: aggregate.commitSha,
	};
}

export function progressAggregateToDto(
	aggregate: ProjectProgress,
): ProjectProgressDto {
	return {
		completedAt: aggregate.completedAt,
		projectId: aggregate.projectId.value,
		status: aggregate.status,
		updatedAt: aggregate.updatedAt,
		userId: aggregate.userId.toString(),
		repositoryUrl: aggregate.repositoryUrl.value,
		repositoryId: aggregate.repositoryId.value,
	};
}
