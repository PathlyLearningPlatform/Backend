export interface LearningPathDto {
	id: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	sectionCount: number;
}

export interface LearningPathProgressDto {
	learningPathId: string;
	userId: string;
	totalSectionCount: number;
	completedSectionCount: number;
	completedAt: Date | null;
}
