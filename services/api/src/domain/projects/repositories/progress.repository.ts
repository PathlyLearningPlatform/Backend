import { ProjectProgress } from '../progress.aggregate';
import { ProjectProgressId, ProjectStatus } from '../value-objects';

export type ListProjectProgressOptions = {
	options?: Partial<{
		limit: number;
		page: number;
	}>;
	where?: Partial<{
		projectId: string;
		userId: string;
		status: ProjectStatus;
	}>;
};

export interface IProjectProgressRepository {
	list(options?: ListProjectProgressOptions): Promise<ProjectProgress[]>;

	findById(id: ProjectProgressId): Promise<ProjectProgress | null>;

	save(aggregate: ProjectProgress): Promise<void>;

	remove(id: ProjectProgressId): Promise<boolean>;
}
