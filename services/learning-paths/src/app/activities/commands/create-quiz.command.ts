export type CreateQuizCommand = {
	name: string;
	description?: string | null;
	lessonId: string;
	order: number;
};
