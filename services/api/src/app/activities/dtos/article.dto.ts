import type { ActivityDto } from "./activity.dto";

export interface ArticleDto extends ActivityDto {
	ref: string;
}
