import { SortType } from '@pathly-backend/contracts/common/types.js';
import { PathsOrderByFields } from '@pathly-backend/contracts/paths/v1/paths.js';
import { z } from 'zod';
import { clientSortTypeToDomain } from '@/infra/common/helpers';
import { clientPathsOrderByFieldsToDomain } from '../helpers';

export const findPathsSchema = z
	.object({
		where: z
			.object({
				limit: z.int32().optional().default(100),
				page: z.int32().optional().default(0),
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
