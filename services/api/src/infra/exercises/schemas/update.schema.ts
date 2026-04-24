import { updateActivitySchema } from '@infra/activities/schemas';
import { difficultySchema } from './fields.schema';

export const updateExercisePropsSchema = updateActivitySchema
	.safeExtend({
		difficulty: difficultySchema.optional(),
	})
	.optional();
