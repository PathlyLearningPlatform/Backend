export type UpdateLessonCommand = {
	where: {
		id: string;
	};
	fields?: {
		name?: string;
		description?: string | null;
		order?: number;
	};
};
