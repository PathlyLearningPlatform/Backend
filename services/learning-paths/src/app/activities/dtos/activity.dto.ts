export interface ActivityDto {
	id: string;
	lessonId: string;
	name: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	order: number;
}
