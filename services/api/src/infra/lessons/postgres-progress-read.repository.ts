import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@infra/common';
import { and, eq } from 'drizzle-orm';
import type {
	LessonProgressDto,
	ListLessonProgressDto,
} from '@/app/lessons/dtos';
import type { ILessonProgressReadRepository } from '@/app/lessons/interfaces';
import type { Db } from '@/infra/db/type';
import { DbService } from '../db/db.service';
import { lessonProgressTable } from '../db/schemas';
import { LessonsApiConstraints } from './enums';

@Injectable()
export class PostgresLessonProgressReadRepository
	implements ILessonProgressReadRepository
{
	private readonly db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(dto?: ListLessonProgressDto): Promise<LessonProgressDto[]> {
		const limit = dto?.options?.limit ?? LessonsApiConstraints.DEFAULT_LIMIT;
		const page = dto?.options?.page ?? LessonsApiConstraints.DEFAULT_PAGE;
		const userId = dto?.where?.userId;
		const unitId = dto?.where?.unitId;

		try {
			return await this.db
				.select()
				.from(lessonProgressTable)
				.where(
					and(
						unitId ? eq(lessonProgressTable.unitId, unitId) : undefined,
						userId ? eq(lessonProgressTable.userId, userId) : undefined,
					),
				)
				.limit(limit)
				.offset(limit * page);
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}

	async findById(id: string): Promise<LessonProgressDto | null> {
		try {
			const [lessonProgress] = await this.db
				.select()
				.from(lessonProgressTable)
				.where(eq(lessonProgressTable.id, id));

			return lessonProgress ?? null;
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}

	async findOneForUser(
		lessonId: string,
		userId: string,
	): Promise<LessonProgressDto | null> {
		try {
			const [lessonProgress] = await this.db
				.select()
				.from(lessonProgressTable)
				.where(
					and(
						eq(lessonProgressTable.lessonId, lessonId),
						eq(lessonProgressTable.userId, userId),
					),
				);

			return lessonProgress ?? null;
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}
}
