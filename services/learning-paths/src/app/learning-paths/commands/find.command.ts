import type { SortType } from '@pathly-backend/common';
import type { LearningPathsOrderByFields } from '@/domain/learning-paths/enums';

/**
 * @description
 * This class represents data needed (required and optional) to find multiple path entities. It includes fields for sorting and pagination.
 */
export class FindLearningPathsCommand {
	options?: {
		limit?: number;
		page?: number;
		sortType?: SortType;
		orderBy?: LearningPathsOrderByFields;
	};
}
