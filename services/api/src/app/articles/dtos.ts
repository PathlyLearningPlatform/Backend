export interface ArticleDto {
	id: string;
	name: string;
	description: string | null;
	ref: string;
	createdAt: Date;
	updatedAt: Date | null;
}
