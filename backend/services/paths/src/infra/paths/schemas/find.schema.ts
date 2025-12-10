import { SortType } from '@pathly-backend/contracts/common/types.js';
import { PathsOrderByFields } from '@pathly-backend/contracts/paths/v1/paths.js';
import { z } from 'zod';

export const findPathsSchema = z
	.object({
		where: z
			.object({
				limit: z.int32().optional().default(100),
				page: z.int32().optional().default(0),
				sortType: z.enum(SortType).optional().default(SortType.DESC),
				orderBy: z
					.enum(PathsOrderByFields)
					.optional()
					.default(PathsOrderByFields.CREATED_AT),
			})
			.strict()
			.optional(),
	})
	.strict();
