import { ActivityType } from '../enums';

export interface IActivity {
	id: string;
	lessonId: string;
	createdAt: string;
	updatedAt: string;
	name: string;
	description: string | null;
	order: number;
	type: ActivityType;
}

export type ActivityRequiredCreateFields = Pick<
	IActivity,
	'lessonId' | 'name' | 'order' | 'type'
>;
export type ActivityAllowedCreateFields = Partial<
	Omit<IActivity, 'id' | 'createdAt' | 'updatedAt'>
>;
export type ActivityCreateFields = ActivityRequiredCreateFields &
	ActivityAllowedCreateFields;

export type ActivityUpdateFields = Partial<
	Omit<IActivity, 'id' | 'createdAt' | 'updatedAt' | 'type'>
>;

export class Activity implements IActivity {
	constructor(fields: IActivity) {
		this.id = fields.id;
		this.createdAt = fields.createdAt;
		this.updatedAt = fields.updatedAt;
		this.lessonId = fields.lessonId;
		this.name = fields.name;
		this.description = fields.description || null;
		this.order = fields.order;
		this.type = fields.type;
	}

	update(fields: ActivityUpdateFields) {
		if (fields.description !== undefined) {
			this.description = fields.description;
		}

		if (fields.lessonId) {
			this.lessonId = fields.lessonId;
		}

		if (fields.name) {
			this.name = fields.name;
		}

		if (fields.order) {
			this.order = fields.order;
		}
	}

	id: string;
	createdAt: string;
	updatedAt: string;
	lessonId: string;
	name: string;
	order: number;
	type: ActivityType;
	description: string | null;
}
