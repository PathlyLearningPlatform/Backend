import { DbService } from '@/infra/db/db.service';
import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@infra/common';
import { eq } from 'drizzle-orm';
import type {
	ISectionRepository,
	ListSectionsOptions,
} from '@/domain/sections/repositories';
import { Section } from '@/domain/sections/section.aggregate';
import { UnitRef } from '@/domain/sections/value-objects';
import type { SectionId } from '@/domain/sections/value-objects/id.vo';
import type { Db } from '@/infra/db/type';
import { sectionsTable, unitsTable } from '../db/schemas';
import { SectionsApiConstraints } from './enums';

@Injectable()
export class PostgresSectionRepository implements ISectionRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	async findById(id: SectionId): Promise<Section | null> {
		const rawId = id.value;

		try {
			const result = await this.db.transaction(async (tx) => {
				const [dbSection] = await tx
					.select()
					.from(sectionsTable)
					.where(eq(sectionsTable.id, rawId));

				if (!dbSection) {
					return null;
				}

				const unitRefs = await tx
					.select({ order: unitsTable.order, unitId: unitsTable.id })
					.from(unitsTable)
					.where(eq(unitsTable.sectionId, rawId));

				const section = Section.fromDataSource({
					id: dbSection.id,
					learningPathId: dbSection.learningPathId,
					name: dbSection.name,
					description: dbSection.description,
					createdAt: dbSection.createdAt,
					updatedAt: dbSection.updatedAt,
					order: dbSection.order,
					unitCount: dbSection.unitCount,
					unitRefs: unitRefs.map((ref) =>
						UnitRef.create({
							order: ref.order,
							unitId: ref.unitId,
						}),
					),
				});

				return section;
			});

			return result;
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async list(filter?: ListSectionsOptions): Promise<Section[]> {
		const limit =
			filter?.options?.limit ?? SectionsApiConstraints.DEFAULT_LIMIT;
		const page = filter?.options?.page ?? SectionsApiConstraints.DEFAULT_PAGE;
		const learningPathId = filter?.where?.learningPathId;

		const sections = await this.db
			.select()
			.from(sectionsTable)
			.where(
				learningPathId
					? eq(sectionsTable.learningPathId, learningPathId)
					: undefined,
			)
			.limit(limit)
			.offset(page * limit);

		return sections.map((item) =>
			Section.fromDataSource({
				...item,
				unitRefs: [],
			}),
		);
	}

	async remove(id: SectionId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(sectionsTable)
				.where(eq(sectionsTable.id, id.value));

			return result.rows.length > 0;
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async save(aggregate: Section): Promise<void> {
		try {
			await this.db
				.insert(sectionsTable)
				.values({
					id: aggregate.id.value,
					learningPathId: aggregate.learningPathId.toString(),
					name: aggregate.name.value,
					description: aggregate.description?.value ?? null,
					order: aggregate.order.value,
					createdAt: aggregate.createdAt,
					updatedAt: aggregate.updatedAt,
					unitCount: aggregate.unitCount,
				})
				.onConflictDoUpdate({
					target: sectionsTable.id,
					set: {
						name: aggregate.name.value,
						description: aggregate.description?.value ?? null,
						order: aggregate.order.value,
						updatedAt: aggregate.updatedAt,
						unitCount: aggregate.unitCount,
					},
				});
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}
}
