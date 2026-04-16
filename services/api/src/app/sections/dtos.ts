export interface SectionDto {
	id: string;
	learningPathId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
	unitCount: number;
}

export interface SectionProgressDto {
	sectionId: string;
	learningPathId: string;
	userId: string;
	completedUnitCount: number;
	totalUnitCount: number;
	completedAt: Date | null;
}
