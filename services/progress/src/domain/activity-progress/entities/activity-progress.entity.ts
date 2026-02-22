export interface ActivityProgressFields {
	id: string;
	activityId: string;
	userId: string;
	completedAt: Date | null;
}

type RequiredCreateFields = Pick<
	ActivityProgressFields,
	'id' | 'activityId' | 'userId'
>;
type AllowedCreateFields = Partial<ActivityProgressFields>;
type CreateFields = RequiredCreateFields & AllowedCreateFields;

export class ActivityProgress implements ActivityProgressFields {
	constructor(fields: CreateFields) {
		this.id = fields.id;
		this.activityId = fields.activityId;
		this.userId = fields.userId;
		this.completedAt = fields.completedAt ?? null;
	}

	complete() {
		this.completedAt = new Date();
	}

	id: string;
	activityId: string;
	userId: string;
	completedAt: Date | null;
}
