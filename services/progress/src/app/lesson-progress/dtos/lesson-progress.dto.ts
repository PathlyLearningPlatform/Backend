export interface LessonProgressDto {
	id: string;
	lessonId: string;
	unitId: string;
	userId: string;
	completedAt: Date | null;
	totalActivityCount: number;
	completedActivityCount: number;
}
