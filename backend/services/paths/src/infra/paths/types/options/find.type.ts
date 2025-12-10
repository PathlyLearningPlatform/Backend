import type { SortType } from 'common/index.js';
import type { PathsOrderByFields } from '@/domain/paths/types';

export type FindPathsOptions = {
	where?: {
		limit?: number;
		page?: number;
		orderBy?: PathsOrderByFields;
		sortType?: SortType;
	};
};
