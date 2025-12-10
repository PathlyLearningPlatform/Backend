import type { SortType } from 'common/index.js';
import type { PathsOrderByFields } from '../types';

export class FindPathsCommand {
	where?: {
		limit?: number;
		page?: number;
		sortType?: SortType;
		orderBy?: PathsOrderByFields;
	};
}
