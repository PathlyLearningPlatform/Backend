import { ActivityType } from '../enums';

export class Activity {
	id: string;
	lessonId: string;
	createdAt: string;
	updatedAt: string;
	name: string;
	description: string | null;
	order: number;
	type: ActivityType;
	external: boolean;
	ref: string | null;
}
