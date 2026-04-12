import { z } from 'zod'
import { limitSchema, pageSchema } from './fields.schema'

export const listActivitiesQuerySchema = z
	.object({
		limit: limitSchema.optional(),
		page: pageSchema.optional(),
	})
	.optional()
