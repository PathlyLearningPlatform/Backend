export type UnitFields = {
	id: string;
	sectionId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
};

export type UnitRequiredCreateFields = Pick<
	UnitFields,
	'name' | 'order' | 'sectionId'
>;
export type UnitAllowedCreateFields = Partial<
	Omit<UnitFields, 'id' | 'createdAt' | 'updatedAt'>
>;
export type UnitCreateFields = UnitRequiredCreateFields &
	UnitAllowedCreateFields;
export type UnitUpdateFields = Partial<
	Omit<UnitFields, 'id' | 'createdAt' | 'updatedAt' | 'sectionId'>
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

export class Unit implements UnitFields {
	constructor(fields: UnitFields) {
		this.id = fields.id;
		this.sectionId = fields.sectionId;
		this.createdAt = fields.createdAt;
		this.updatedAt = fields.updatedAt;
		this.name = fields.name;
		this.description = fields.description;
		this.order = fields.order;
	}

	update(fields: UnitUpdateFields) {
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
	sectionId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
}
