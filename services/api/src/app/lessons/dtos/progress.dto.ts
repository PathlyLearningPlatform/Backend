export interface LessonProgressDto {
	lessonId: string;
	unitId: string;
	userId: string;
	completedAt: Date | null;
	totalActivityCount: number;
	completedActivityCount: number;
}
