import { updateActivitySchema } from '@infra/activities/schemas';

export const updateQuizPropsSchema = updateActivitySchema
	.safeExtend({})
	.optional();
