import { Project } from '../project.aggregate';
import { ProjectId } from '../value-objects';
import { RepositoryId } from '@/domain/common';

export type ListProjectsOptions = {
	options?: Partial<{
		limit: number;
		page: number;
	}>;
};

export interface IProjectRepository {
	list(options?: ListProjectsOptions): Promise<Project[]>;

	findById(id: ProjectId): Promise<Project | null>;

	findByRepositoryId(id: RepositoryId): Promise<Project | null>;

	save(aggregate: Project): Promise<void>;

	remove(id: ProjectId): Promise<boolean>;
}
