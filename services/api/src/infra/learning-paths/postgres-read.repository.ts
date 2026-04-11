import * as schema from '@/infra/db/schemas';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { LearningPathDto } from '@/app/learning-paths/dtos';
import type {
	ILearningPathReadRepository,
	LearningPathFilter,
} from '@/app/learning-paths/interfaces';
import { DbService } from '../db/db.service';
import { LearningPathsApiConstraints } from './enums';

@Injectable()
export class PostgresLearningPathReadRepository
	implements ILearningPathReadRepository
{
	private readonly db: NodePgDatabase<typeof schema>;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(filter?: LearningPathFilter): Promise<LearningPathDto[]> {
		const limit =
			filter?.options?.limit ?? LearningPathsApiConstraints.DEFAULT_LIMIT;
		const page =
			filter?.options?.page ?? LearningPathsApiConstraints.DEFAULT_PAGE;

		const learningPaths = await this.db
			.select()
			.from(schema.learningPathsTable)
			.limit(limit)
			.offset(page * limit);

		return learningPaths;
	}

	async findById(id: string): Promise<LearningPathDto | null> {
		const [learningPath] = await this.db
			.select()
			.from(schema.learningPathsTable)
			.where(eq(schema.learningPathsTable.id, id));

		return learningPath ?? null;
	}
}
