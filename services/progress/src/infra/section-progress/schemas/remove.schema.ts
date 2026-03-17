import z from 'zod';
import { sectionProgressIdSchema } from './fields';

export const removeSectionProgressSchema = z
	.object({
		id: sectionProgressIdSchema,
	})
	.strict();
