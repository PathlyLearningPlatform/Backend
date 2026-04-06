import type { ActivityType } from "@/domain/activities/value-objects";

export interface ActivityDto {
	id: string;
	lessonId: string;
	name: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	type: ActivityType;
	order: number;
}
