export type UpdateLearningPathCommand = {
	where: {
		id: string;
	};
	fields?: {
		name?: string;
		description?: string | null;
	};
};
