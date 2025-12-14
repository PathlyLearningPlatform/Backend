import type { SortType } from '@pathly-backend/common/index.js';
import type { PathsOrderByFields } from '@/domain/paths/enums';

export type FindPathsOptions = {
	options?: {
		limit?: number;
		page?: number;
		orderBy?: PathsOrderByFields;
		sortType?: SortType;
	};
};
