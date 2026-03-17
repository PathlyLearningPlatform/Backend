import z from 'zod';
import { sectionProgressIdSchema } from './fields';

export const findSectionProgressByIdSchema = z
	.object({
		id: sectionProgressIdSchema,
	})
	.strict();
