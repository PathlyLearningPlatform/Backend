import type { ActivityType } from '../enums';

export interface ActivityFields {
	id: string;
	lessonId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
	type: ActivityType;
}

export type ActivityCreateFields = Pick<
	ActivityFields,
	'id' | 'name' | 'order' | 'lessonId' | 'createdAt' | 'type'
> &
	Partial<ActivityFields>;

export type ActivityUpdateFields = Partial<
	Omit<ActivityFields, 'id' | 'createdAt' | 'updatedAt' | 'type'>
>;
export type ActivityQuery = {
	options?: {
		limit?: number;
		page?: number;
	};
	where?: {
		lessonId?: string;
	};
};

export class Activity implements ActivityFields {
	constructor(fields: ActivityCreateFields) {
		this.id = fields.id;
		this.createdAt = fields.createdAt;
		this.updatedAt = fields.updatedAt ?? null;
		this.lessonId = fields.lessonId;
		this.name = fields.name;
		this.description = fields.description ?? null;
		this.order = fields.order;
		this.type = fields.type;
	}

	update(fields: ActivityUpdateFields) {
		if (fields.description !== undefined) {
			this.description = fields.description;
		}

		if (fields.lessonId !== undefined) {
			this.lessonId = fields.lessonId;
		}

		if (fields.name !== undefined) {
			this.name = fields.name;
		}

		if (fields.order !== undefined) {
			this.order = fields.order;
		}
	}

	id: string;
	createdAt: Date;
	updatedAt: Date | null;
	lessonId: string;
	name: string;
	order: number;
	type: ActivityType;
	description: string | null;
}
