export interface LearningPathDto {
	id: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	sectionCount: number;
}
