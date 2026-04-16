export interface UnitDto {
	id: string;
	sectionId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
	lessonCount: number;
}

export interface UnitProgressDto {
	sectionId: string;
	unitId: string;
	userId: string;
	totalLessonCount: number;
	completedLessonCount: number;
	completedAt: Date | null;
}
