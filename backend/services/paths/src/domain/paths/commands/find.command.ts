import type { SortType } from '@pathly-backend/common';
import type { PathsOrderByFields } from '../enums';

/**
 * @description
 * This class represents data needed (required and optional) to find multiple path entities. It includes fields for sorting and pagination.
 */
export class FindPathsCommand {
	options?: {
		limit?: number;
		page?: number;
		sortType?: SortType;
		orderBy?: PathsOrderByFields;
	};
}
