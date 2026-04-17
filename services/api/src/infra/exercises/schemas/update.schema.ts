import { difficultySchema } from '@infra/activities/schemas/fields.schema';
import { updateActivitySchema } from '@infra/activities/schemas';

export const updateExercisePropsSchema = updateActivitySchema
	.safeExtend({
		difficulty: difficultySchema.optional(),
	})
	.optional();
