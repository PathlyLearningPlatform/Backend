import {
	Project,
	type IProjectRepository,
	type ListProjectsOptions,
	type ProjectId,
} from '@/domain/projects';
import { DbException } from '@infra/common';
import { eq } from 'drizzle-orm';
import { DbService } from '@/infra/db/db.service';
import { projectsTable } from '@/infra/db/schemas';
import type { Db } from '@/infra/db/type';
import { Inject, Injectable } from '@nestjs/common';
import { ProjectApiConstraints } from '../enums';

@Injectable()
export class PostgresProjectRepository implements IProjectRepository {
	private db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(options?: ListProjectsOptions): Promise<Project[]> {
		const limit =
			options?.options?.limit ?? ProjectApiConstraints.DEFAULT_LIMIT;
		const page = options?.options?.page ?? ProjectApiConstraints.DEFAULT_PAGE;

		try {
			const projects = await this.db
				.select()
				.from(projectsTable)
				.limit(limit)
				.offset(page * limit);

			return projects.map(Project.fromDataSource);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async findById(id: ProjectId): Promise<Project | null> {
		try {
			const [project] = await this.db
				.select()
				.from(projectsTable)
				.where(eq(projectsTable.id, id.value));

			if (!project) {
				return null;
			}

			return Project.fromDataSource(project);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async save(aggregate: Project): Promise<void> {
		try {
			await this.db
				.insert(projectsTable)
				.values({
					id: aggregate.id.value,
					name: aggregate.name,
					description: aggregate.description,
					acceptUrl: aggregate.acceptUrl.value,
					createdAt: aggregate.createdAt,
					updatedAt: aggregate.updatedAt,
				})
				.onConflictDoUpdate({
					target: projectsTable.id,
					set: {
						name: aggregate.name,
						description: aggregate.description,
						acceptUrl: aggregate.acceptUrl.value,
						updatedAt: aggregate.updatedAt,
					},
				});
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async remove(id: ProjectId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(projectsTable)
				.where(eq(projectsTable.id, id.value));

			return result.rows.length > 0;
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}
}
