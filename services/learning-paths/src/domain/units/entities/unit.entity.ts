type Fields = {
	id: string;
	sectionId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
	lessonCount: number;
};

export type CreateFields = Pick<
	Fields,
	'id' | 'name' | 'order' | 'createdAt' | 'sectionId'
> &
	Partial<Fields>;
export type UpdateFields = Partial<
	Omit<Fields, 'id' | 'createdAt' | 'updatedAt' | 'sectionId'>
>;
export type UnitQuery = {
	options?: {
		limit?: number;
		page?: number;
	};
	where?: {
		name?: string;
		sectionId?: string;
	};
};

export class Unit implements Fields {
	constructor(fields: CreateFields) {
		this.id = fields.id;
		this.sectionId = fields.sectionId;
		this.createdAt = fields.createdAt;
		this.updatedAt = fields.updatedAt ?? null;
		this.name = fields.name;
		this.description = fields.description ?? null;
		this.order = fields.order;
		this.lessonCount = fields.lessonCount ?? 0;
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

		if (fields.lessonCount !== undefined) {
			this.lessonCount = fields.lessonCount;
		}
	}

	id: string;
	sectionId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
	lessonCount: number;
}
