import type { SortType } from '@pathly-backend/common';
import type { PathsOrderByFields } from '../enums';

export class FindPathsCommand {
	options?: {
		limit?: number;
		page?: number;
		sortType?: SortType;
		orderBy?: PathsOrderByFields;
	};
}
