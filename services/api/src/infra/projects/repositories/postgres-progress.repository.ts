import {
	ProjectProgress,
	type IProjectProgressRepository,
	type ListProjectProgressOptions,
	type ProjectProgressId,
} from '@/domain/projects';
import { DbException } from '@infra/common';
import { and, eq } from 'drizzle-orm';
import { DbService } from '@/infra/db/db.service';
import { projectProgressTable } from '@/infra/db/schemas';
import type { Db } from '@/infra/db/type';
import { Inject, Injectable } from '@nestjs/common';
import { ProjectApiConstraints } from '../enums';

@Injectable()
export class PostgresProjectProgressRepository
	implements IProjectProgressRepository
{
	private db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(options?: ListProjectProgressOptions): Promise<ProjectProgress[]> {
		const limit =
			options?.options?.limit ?? ProjectApiConstraints.DEFAULT_LIMIT;
		const page = options?.options?.page ?? ProjectApiConstraints.DEFAULT_PAGE;
		const projectId = options?.where?.projectId;
		const userId = options?.where?.userId;
		const status = options?.where?.status;

		try {
			const projectProgress = await this.db
				.select()
				.from(projectProgressTable)
				.where(
					and(
						projectId
							? eq(projectProgressTable.projectId, projectId)
							: undefined,
						userId ? eq(projectProgressTable.userId, userId) : undefined,
						status ? eq(projectProgressTable.status, status) : undefined,
					),
				)
				.limit(limit)
				.offset(limit * page);

			return projectProgress.map(ProjectProgress.fromDataSource);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async findById(id: ProjectProgressId): Promise<ProjectProgress | null> {
		try {
			const [projectProgress] = await this.db
				.select()
				.from(projectProgressTable)
				.where(
					and(
						eq(projectProgressTable.projectId, id.projectId.value),
						eq(projectProgressTable.userId, id.userId.toString()),
					),
				);

			if (!projectProgress) {
				return null;
			}

			return ProjectProgress.fromDataSource(projectProgress);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async save(aggregate: ProjectProgress): Promise<void> {
		try {
			await this.db
				.insert(projectProgressTable)
				.values({
					projectId: aggregate.projectId.value,
					userId: aggregate.userId.toString(),
					completedAt: aggregate.completedAt,
					updatedAt: aggregate.updatedAt,
					status: aggregate.status,
					repositoryUrl: aggregate.repositoryUrl.value,
				})
				.onConflictDoUpdate({
					target: [projectProgressTable.projectId, projectProgressTable.userId],
					set: {
						completedAt: aggregate.completedAt,
						updatedAt: aggregate.updatedAt,
						status: aggregate.status,
						repositoryUrl: aggregate.repositoryUrl.value,
					},
				});
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async remove(id: ProjectProgressId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(projectProgressTable)
				.where(
					and(
						eq(projectProgressTable.projectId, id.projectId.value),
						eq(projectProgressTable.userId, id.userId.toString()),
					),
				);

			return result.rows.length > 0;
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}
}
