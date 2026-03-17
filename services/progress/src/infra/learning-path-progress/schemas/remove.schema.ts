import z from 'zod';
import { learningPathProgressIdSchema } from './fields';

export const removeLearningPathProgressSchema = z
	.object({
		id: learningPathProgressIdSchema,
	})
	.strict();
