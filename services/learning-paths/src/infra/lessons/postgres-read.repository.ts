import { Inject, Injectable } from '@nestjs/common';
import { DbService } from '../common/db/db.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@infra/common/db/schemas';
import { ILessonReadRepository } from '@/app/lessons/interfaces';
import { LessonDto } from '@/app/lessons/dtos';
import { eq } from 'drizzle-orm';
import { LessonsApiConstraints } from './enums';

@Injectable()
export class PostgresLessonReadRepository implements ILessonReadRepository {
	private readonly db: NodePgDatabase<typeof schema>;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(
		filter?: Parameters<ILessonReadRepository['list']>[0],
	): Promise<LessonDto[]> {
		const limit = filter?.options?.limit ?? LessonsApiConstraints.DEFAULT_LIMIT;
		const page = filter?.options?.page ?? LessonsApiConstraints.DEFAULT_PAGE;
		const unitId = filter?.where?.unitId;

		const lessons = await this.db
			.select()
			.from(schema.lessonsTable)
			.where(unitId ? eq(schema.lessonsTable.unitId, unitId) : undefined)
			.limit(limit)
			.offset(page * limit);

		return lessons;
	}

	async findById(id: string): Promise<LessonDto | null> {
		const [lesson] = await this.db
			.select()
			.from(schema.lessonsTable)
			.where(eq(schema.lessonsTable.id, id));

		return lesson ?? null;
	}
}
