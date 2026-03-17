import z from 'zod';
import { learningPathProgressIdSchema } from './fields';

export const findLearningPathProgressByIdSchema = z
	.object({
		id: learningPathProgressIdSchema,
	})
	.strict();
