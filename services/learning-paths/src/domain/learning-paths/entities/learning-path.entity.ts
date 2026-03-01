import type { SortType } from '@pathly-backend/common/index.js';
import type { LearningPathsOrderByFields } from '../enums';

type Fields = {
	id: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	sectionCount: number;
};

type CreateFields = Pick<Fields, 'name' | 'id' | 'createdAt'> & Partial<Fields>;
type UpdateFields = Partial<Omit<Fields, 'id' | 'createdAt' | 'updatedAt'>>;

export type LearningPathQuery = {
	options?: {
		limit?: number;
		page?: number;
		sortType?: SortType;
		orderBy?: LearningPathsOrderByFields;
	};
	where?: {
		name?: string;
	};
};

export class LearningPath implements Fields {
	constructor(fields: CreateFields) {
		this.id = fields.id;
		this.createdAt = fields.createdAt;
		this.updatedAt = fields.updatedAt ?? null;
		this.name = fields.name;
		this.description = fields.description ?? null;
		this.sectionCount = fields.sectionCount ?? 0;
	}

	update(fields: UpdateFields) {
		if (fields.sectionCount !== undefined) {
			this.sectionCount = fields.sectionCount;
		}

		if (fields.description !== undefined) {
			this.description = fields.description;
		}

		if (fields.name !== undefined) {
			this.name = fields.name;
		}
	}

	id: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	sectionCount: number;
}
