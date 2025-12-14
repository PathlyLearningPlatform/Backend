import { PathsOrderByFields } from '@/domain/paths/enums'
import { SortType } from '@pathly-backend/common/index.js'
import z from 'zod'
import { PathsApiConstraints } from '../enums'

export const findPathsQuerySchema = z
	.object({
		limit: z
			.int32()
			.min(PathsApiConstraints.MIN_LIMIT)
			.max(PathsApiConstraints.MAX_LIMIT)
			.default(PathsApiConstraints.DEFAULT_LIMIT),
		page: z.int32().nonnegative().default(PathsApiConstraints.DEFAULT_PAGE),
		orderBy: z.enum(PathsOrderByFields).default(PathsOrderByFields.CREATED_AT),
		sortType: z.enum(SortType).default(SortType.DESC),
	})
	.strict()
	.optional()
