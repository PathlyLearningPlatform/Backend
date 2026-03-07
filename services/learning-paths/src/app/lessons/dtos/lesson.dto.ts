export interface LessonDto {
	id: string;
	unitId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
	activityCount: number;
}
