import { refSchema } from './fields.schema';
import { updateActivitySchema } from '@/infra/activities/schemas';

export const updateArticlePropsSchema = updateActivitySchema
	.safeExtend({
		ref: refSchema.optional(),
	})
	.optional();
