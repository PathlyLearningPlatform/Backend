export interface SectionProgressDto {
	sectionId: string;
	learningPathId: string;
	userId: string;
	completedUnitCount: number;
	totalUnitCount: number;
	completedAt: Date | null;
}
