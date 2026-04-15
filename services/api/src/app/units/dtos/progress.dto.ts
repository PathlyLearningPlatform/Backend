export interface UnitProgressDto {
	sectionId: string;
	unitId: string;
	userId: string;
	totalLessonCount: number;
	completedLessonCount: number;
	completedAt: Date | null;
}
