import {
	ProjectSubmission,
	type FindFirstProjectSubmissionOptions,
	type IProjectSubmissionRepository,
	type ListProjectSubmissionsOptions,
	type ProjectSubmissionId,
} from '@/domain/projects';
import { DbException } from '@infra/common';
import { and, eq } from 'drizzle-orm';
import { DbService } from '@/infra/db/db.service';
import { projectSubmissionsTable } from '@/infra/db/schemas';
import type { Db } from '@/infra/db/types';
import { Inject, Injectable } from '@nestjs/common';
import { ProjectApiConstraints } from '../enums';

@Injectable()
export class PostgresProjectSubmissionRepository
	implements IProjectSubmissionRepository
{
	private db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(
		options?: ListProjectSubmissionsOptions,
	): Promise<ProjectSubmission[]> {
		const limit =
			options?.options?.limit ?? ProjectApiConstraints.DEFAULT_LIMIT;
		const page = options?.options?.page ?? ProjectApiConstraints.DEFAULT_PAGE;
		const projectId = options?.where?.projectId?.value;
		const userId = options?.where?.userId?.toString();
		const status = options?.where?.status;

		try {
			const projectSubmissions = await this.db
				.select()
				.from(projectSubmissionsTable)
				.where(
					and(
						projectId
							? eq(projectSubmissionsTable.projectId, projectId)
							: undefined,
						userId ? eq(projectSubmissionsTable.userId, userId) : undefined,
						status ? eq(projectSubmissionsTable.status, status) : undefined,
					),
				)
				.limit(limit)
				.offset(limit * page);

			return projectSubmissions.map(ProjectSubmission.fromDataSource);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async findFirst(
		options: FindFirstProjectSubmissionOptions,
	): Promise<ProjectSubmission | null> {
		const userId = options.userId;
		const projectId = options.projectId;
		const submissionId = options.submissionId;
		const status = options.status;
		const commitSha = options.commitSha;

		try {
			const [projectSubmission] = await this.db
				.select()
				.from(projectSubmissionsTable)
				.where(
					and(
						userId ? eq(projectSubmissionsTable.userId, userId) : undefined,
						projectId
							? eq(projectSubmissionsTable.projectId, projectId)
							: undefined,
						submissionId
							? eq(projectSubmissionsTable.id, submissionId)
							: undefined,
						status ? eq(projectSubmissionsTable.status, status) : undefined,
						commitSha
							? eq(projectSubmissionsTable.commitSha, commitSha)
							: undefined,
					),
				);

			if (!projectSubmission) {
				return null;
			}

			return ProjectSubmission.fromDataSource(projectSubmission);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async findById(id: ProjectSubmissionId): Promise<ProjectSubmission | null> {
		try {
			const [projectSubmission] = await this.db
				.select()
				.from(projectSubmissionsTable)
				.where(eq(projectSubmissionsTable.id, id.value));

			if (!projectSubmission) {
				return null;
			}

			return ProjectSubmission.fromDataSource(projectSubmission);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async save(aggregate: ProjectSubmission): Promise<void> {
		try {
			await this.db
				.insert(projectSubmissionsTable)
				.values({
					id: aggregate.id.value,
					projectId: aggregate.projectId.value,
					userId: aggregate.userId.toString(),
					submittedAt: aggregate.submittedAt,
					updatedAt: aggregate.updatedAt,
					status: aggregate.status,
					commitSha: aggregate.commitSha,
				})
				.onConflictDoUpdate({
					target: projectSubmissionsTable.id,
					set: {
						projectId: aggregate.projectId.value,
						userId: aggregate.userId.toString(),
						submittedAt: aggregate.submittedAt,
						updatedAt: aggregate.updatedAt,
						status: aggregate.status,
					},
				});
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async remove(id: ProjectSubmissionId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(projectSubmissionsTable)
				.where(eq(projectSubmissionsTable.id, id.value));

			return result.rows.length > 0;
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}
}
