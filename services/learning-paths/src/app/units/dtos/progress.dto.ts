export interface UnitProgressDto {
	id: string;
	sectionId: string;
	unitId: string;
	userId: string;
	totalLessonCount: number;
	completedLessonCount: number;
	completedAt: Date | null;
}
