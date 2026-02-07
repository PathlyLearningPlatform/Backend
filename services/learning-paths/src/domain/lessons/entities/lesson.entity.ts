export type LessonFields = {
	id: string;
	unitId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
};

export type LessonRequiredCreateFields = Pick<
	LessonFields,
	'name' | 'order' | 'unitId'
>;
export type LessonAllowedCreateFields = Partial<
	Omit<LessonFields, 'id' | 'createdAt' | 'updatedAt'>
>;
export type LessonCreateFields = LessonRequiredCreateFields &
	LessonAllowedCreateFields;
export type LessonUpdateFields = Partial<
	Omit<LessonFields, 'id' | 'createdAt' | 'updatedAt' | 'unitId'>
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

export class Lesson implements LessonFields {
	constructor(fields: LessonFields) {
		this.id = fields.id;
		this.unitId = fields.unitId;
		this.createdAt = fields.createdAt;
		this.updatedAt = fields.updatedAt;
		this.name = fields.name;
		this.description = fields.description;
		this.order = fields.order;
	}

	update(fields: LessonUpdateFields) {
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
	unitId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
}
