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

export interface LessonProgressDto {
	lessonId: string;
	unitId: string;
	userId: string;
	completedAt: Date | null;
	totalActivityCount: number;
	completedActivityCount: number;
}
