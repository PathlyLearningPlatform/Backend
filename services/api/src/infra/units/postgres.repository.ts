import { DbService } from '@/infra/db/db.service';
import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@infra/common';
import { eq } from 'drizzle-orm';
import type {
	IUnitRepository,
	ListUnitsOptions,
} from '@/domain/units/repositories';
import { Unit } from '@/domain/units/unit.aggregate';
import { LessonRef } from '@/domain/units/value-objects';
import type { UnitId } from '@/domain/units/value-objects/id.vo';
import type { Db } from '@/infra/db/type';
import { lessonsTable, unitsTable } from '../db/schemas';
import { UnitsApiConstraints } from './enums';

@Injectable()
export class PostgresUnitRepository implements IUnitRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	async findById(id: UnitId): Promise<Unit | null> {
		const rawId = id.value;

		try {
			const result = await this.db.transaction(async (tx) => {
				const [dbUnit] = await tx
					.select()
					.from(unitsTable)
					.where(eq(unitsTable.id, rawId));

				if (!dbUnit) {
					return null;
				}

				const lessonRefs = await tx
					.select({ order: lessonsTable.order, lessonId: lessonsTable.id })
					.from(lessonsTable)
					.where(eq(lessonsTable.unitId, rawId));

				const unit = Unit.fromDataSource({
					id: dbUnit.id,
					sectionId: dbUnit.sectionId,
					name: dbUnit.name,
					description: dbUnit.description,
					createdAt: dbUnit.createdAt,
					updatedAt: dbUnit.updatedAt,
					order: dbUnit.order,
					lessonCount: dbUnit.lessonCount,
					lessonRefs: lessonRefs.map((ref) =>
						LessonRef.create({
							order: ref.order,
							lessonId: ref.lessonId,
						}),
					),
				});

				return unit;
			});

			return result;
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async list(filter?: ListUnitsOptions): Promise<Unit[]> {
		const limit = filter?.options?.limit ?? UnitsApiConstraints.DEFAULT_LIMIT;
		const page = filter?.options?.page ?? UnitsApiConstraints.DEFAULT_PAGE;
		const sectionId = filter?.where?.sectionId;

		const units = await this.db
			.select()
			.from(unitsTable)
			.where(sectionId ? eq(unitsTable.sectionId, sectionId) : undefined)
			.limit(limit)
			.offset(page * limit);

		return units.map((item) =>
			Unit.fromDataSource({
				...item,
				lessonRefs: [],
			}),
		);
	}

	async remove(id: UnitId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(unitsTable)
				.where(eq(unitsTable.id, id.value));

			return result.rows.length > 0;
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async save(aggregate: Unit): Promise<void> {
		try {
			await this.db
				.insert(unitsTable)
				.values({
					id: aggregate.id.value,
					sectionId: aggregate.sectionId.value,
					name: aggregate.name.value,
					description: aggregate.description?.value ?? null,
					order: aggregate.order.value,
					createdAt: aggregate.createdAt,
					updatedAt: aggregate.updatedAt,
					lessonCount: aggregate.lessonCount,
				})
				.onConflictDoUpdate({
					target: unitsTable.id,
					set: {
						name: aggregate.name.value,
						description: aggregate.description?.value ?? null,
						order: aggregate.order.value,
						updatedAt: aggregate.updatedAt,
						lessonCount: aggregate.lessonCount,
					},
				});
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}
}
