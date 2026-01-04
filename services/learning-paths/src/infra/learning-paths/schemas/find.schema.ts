import { SortType } from '@pathly-backend/contracts/common/types.js';
import { LearningPathsOrderByFields } from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js';
import { z } from 'zod';
import { clientSortTypeToDomain } from '@/infra/common/helpers';
import { LearningPathsApiConstraints } from '../enums';
import { clientLearningPathsOrderByFieldsToDomain } from '../helpers';

export const findLearningPathsSchema = z
	.object({
		options: z
			.object({
				limit: z
					.int32()
					.min(LearningPathsApiConstraints.MIN_LIMIT)
					.max(LearningPathsApiConstraints.MAX_LIMIT)
					.optional()
					.default(LearningPathsApiConstraints.DEFAULT_LIMIT),
				page: z
					.int32()
					.nonnegative()
					.optional()
					.default(LearningPathsApiConstraints.DEFAULT_PAGE),
				sortType: z
					.enum(SortType)
					.optional()
					.default(SortType.DESC)
					.transform(clientSortTypeToDomain),
				orderBy: z
					.enum(LearningPathsOrderByFields)
					.optional()
					.default(LearningPathsOrderByFields.CREATED_AT)
					.transform(clientLearningPathsOrderByFieldsToDomain),
			})
			.strict()
			.optional(),
	})
	.strict();
