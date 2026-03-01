export type UpdateQuizCommand = {
	where: {
		activityId: string;
	};
	fields?: {
		name?: string;
		description?: string | null;
		order?: number;
		lessonId?: string;
	};
};
