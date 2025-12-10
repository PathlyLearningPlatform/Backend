import type { SortType } from '@pathly-backend/common';
import type { PathsOrderByFields } from '../types';

export class FindPathsCommand {
	where?: {
		limit?: number;
		page?: number;
		sortType?: SortType;
		orderBy?: PathsOrderByFields;
	};
}
