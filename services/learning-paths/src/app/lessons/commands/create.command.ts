export type CreateLessonCommand = {
	name: string;
	description?: string | null;
	unitId: string;
	order: number;
};
