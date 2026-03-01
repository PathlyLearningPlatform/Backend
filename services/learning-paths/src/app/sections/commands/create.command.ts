export type CreateSectionCommand = {
	name: string;
	description?: string | null;
	learningPathId: string;
	order: number;
};
