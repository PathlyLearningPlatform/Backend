export type SectionFields = {
	id: string;
	learningPathId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
};

export type SectionRequiredCreateFields = Pick<
	SectionFields,
	'name' | 'order' | 'learningPathId'
>;
export type SectionAllowedCreateFields = Partial<
	Omit<SectionFields, 'id' | 'createdAt' | 'updatedAt'>
>;
export type SectionCreateFields = SectionRequiredCreateFields &
	SectionAllowedCreateFields;
export type SectionUpdateFields = Partial<
	Omit<SectionFields, 'id' | 'createdAt' | 'updatedAt' | 'learningPathId'>
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

export class Section implements SectionFields {
	constructor(fields: SectionFields) {
		this.id = fields.id;
		this.learningPathId = fields.learningPathId;
		this.createdAt = fields.createdAt;
		this.updatedAt = fields.updatedAt;
		this.name = fields.name;
		this.description = fields.description;
		this.order = fields.order;
	}

	update(fields: SectionUpdateFields) {
		if (fields.description !== undefined) {
			this.description = fields.description;
		}

		if (fields.name !== undefined) {
			this.name = fields.name;
		}

		if (fields.order !== undefined) {
			this.order = fields.order;
		}
	}

	id: string;
	learningPathId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
}
