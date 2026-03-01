type Fields = {
	id: string;
	learningPathId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
	unitCount: number;
};

type CreateFields = Pick<
	Fields,
	'name' | 'id' | 'order' | 'learningPathId' | 'createdAt'
> &
	Partial<Fields>;
type UpdateFields = Partial<
	Omit<Fields, 'id' | 'createdAt' | 'updatedAt' | 'learningPathId'>
>;
export type SectionQuery = {
	options?: {
		limit?: number;
		page?: number;
	};
	where?: {
		name?: string;
		learningPathId?: string;
	};
};

export class Section implements Fields {
	constructor(fields: CreateFields) {
		this.id = fields.id;
		this.learningPathId = fields.learningPathId;
		this.createdAt = fields.createdAt;
		this.updatedAt = fields.updatedAt ?? null;
		this.name = fields.name;
		this.description = fields.description ?? null;
		this.order = fields.order;
		this.unitCount = fields.unitCount ?? 0;
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

		if (fields.unitCount !== undefined) {
			this.unitCount = fields.unitCount;
		}
	}

	id: string;
	learningPathId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
	unitCount: number;
}
