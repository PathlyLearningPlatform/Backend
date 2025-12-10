import type { SortType } from '@pathly-backend/common/index.js';
import type { PathsOrderByFields } from '@/domain/paths/types';

export type FindPathsOptions = {
	where?: {
		limit?: number;
		page?: number;
		orderBy?: PathsOrderByFields;
		sortType?: SortType;
	};
};
