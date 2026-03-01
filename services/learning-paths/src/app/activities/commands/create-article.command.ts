export type CreateArticleCommand = {
	name: string;
	description?: string | null;
	lessonId: string;
	order: number;
	ref: string;
};
