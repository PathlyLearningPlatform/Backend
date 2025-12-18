import { SortType } from '@pathly-backend/contracts/common/types.js';
import { PathsOrderByFields } from '@pathly-backend/contracts/paths/v1/paths.js';
import { z } from 'zod';
import { clientSortTypeToDomain } from '@/infra/common/helpers';
import { clientPathsOrderByFieldsToDomain } from '../helpers';
import { PathsApiConstraints } from '../enums';

export const findPathsSchema = z
	.object({
		options: z
			.object({
				limit: z
					.int32()
					.min(PathsApiConstraints.MIN_LIMIT)
					.max(PathsApiConstraints.MAX_LIMIT)
					.optional()
					.default(PathsApiConstraints.DEFAULT_LIMIT),
				page: z
					.int32()
					.nonnegative()
					.optional()
					.default(PathsApiConstraints.DEFAULT_PAGE),
				sortType: z
					.enum(SortType)
					.optional()
					.default(SortType.DESC)
					.transform(clientSortTypeToDomain),
				orderBy: z
					.enum(PathsOrderByFields)
					.optional()
					.default(PathsOrderByFields.CREATED_AT)
					.transform(clientPathsOrderByFieldsToDomain),
			})
			.strict()
			.optional(),
	})
	.strict();
