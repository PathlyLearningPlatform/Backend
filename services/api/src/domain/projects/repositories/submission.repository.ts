import { UserId } from '@/domain/common';
import { ProjectSubmission } from '../submission.aggregate';
import {
	ProjectId,
	ProjectSubmissionId,
	ProjectSubmissionStatus,
} from '../value-objects';

export type ListProjectSubmissionsOptions = {
	options?: Partial<{
		limit: number;
		page: number;
	}>;
	where?: Partial<{
		projectId: ProjectId;
		userId: UserId;
		status: ProjectSubmissionStatus;
	}>;
};

export interface IProjectSubmissionRepository {
	list(options?: ListProjectSubmissionsOptions): Promise<ProjectSubmission[]>;

	findById(id: ProjectSubmissionId): Promise<ProjectSubmission | null>;

	save(aggregate: ProjectSubmission): Promise<void>;

	remove(id: ProjectSubmissionId): Promise<boolean>;
}
