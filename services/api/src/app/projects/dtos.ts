import { ProjectStatus, ProjectSubmissionStatus } from '@/domain/projects';

export interface ProjectDto {
	id: string;
	name: string;
	acceptUrl: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	repositoryId: number;
}

export interface ProjectSubmissionDto {
	id: string;
	projectId: string;
	submittedAt: Date;
	updatedAt: Date | null;
	status: ProjectSubmissionStatus;
	userId: string;
	commitSha: string;
}

export interface ProjectProgressDto {
	userId: string;
	projectId: string;
	completedAt: Date | null;
	updatedAt: Date | null;
	status: ProjectStatus;
	repositoryUrl: string;
	repositoryId: number;
}
