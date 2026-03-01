type Fields = {
	id: string;
	unitId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
	activityCount: number;
};

type CreateFields = Pick<
	Fields,
	'id' | 'unitId' | 'order' | 'createdAt' | 'name'
> &
	Partial<Fields>;
type UpdateFields = Partial<
	Omit<Fields, 'id' | 'createdAt' | 'updatedAt' | 'unitId'>
>;
export type LessonQuery = {
	options?: {
		limit?: number;
		page?: number;
	};
	where?: {
		name?: string;
		unitId?: string;
	};
};

export class Lesson implements Fields {
	constructor(fields: CreateFields) {
		this.id = fields.id;
		this.unitId = fields.unitId;
		this.createdAt = fields.createdAt;
		this.updatedAt = fields.updatedAt ?? null;
		this.name = fields.name;
		this.description = fields.description ?? null;
		this.order = fields.order;
		this.activityCount = fields.activityCount ?? 0;
	}

	update(fields: UpdateFields) {
		if (fields.description !== undefined) {
			this.description = fields.description;
		}

		if (fields.name !== undefined) {
			this.name = fields.name;
		}

		if (fields.order !== undefined) {
			this.order = fields.order;
		}

		if (fields.activityCount !== undefined) {
			this.activityCount = fields.activityCount;
		}
	}

	id: string;
	unitId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
	activityCount: number;
}
