export interface LearningPathProgressDto {
	learningPathId: string;
	userId: string;
	totalSectionCount: number;
	completedSectionCount: number;
	completedAt: Date | null;
}
