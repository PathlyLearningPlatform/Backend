import type { SortType } from '@pathly-backend/common/index.js';
import type { LearningPathsOrderByFields } from '../enums';

export type LearningPathFields = {
	id: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
};

export type LearningPathRequiredCreateFields = Pick<LearningPathFields, 'name'>;
export type LearningPathAllowedCreateFields = Partial<
	Omit<LearningPathFields, 'id' | 'createdAt' | 'updatedAt'>
>;
export type LearningPathCreateFields = LearningPathRequiredCreateFields &
	LearningPathAllowedCreateFields;
export type LearningPathUpdateFields = Partial<
	Omit<LearningPathFields, 'id' | 'createdAt' | 'updatedAt'>
>;
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

export class LearningPath implements LearningPathFields {
	constructor(fields: LearningPathFields) {
		this.id = fields.id;
		this.createdAt = fields.createdAt;
		this.updatedAt = fields.updatedAt;
		this.name = fields.name;
		this.description = fields.description;
	}

	update(fields: LearningPathUpdateFields) {
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
}
