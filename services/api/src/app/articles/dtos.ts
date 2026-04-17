import { ActivityDto } from '../activities/dtos';

export interface ArticleDto extends ActivityDto {
	ref: string;
}
