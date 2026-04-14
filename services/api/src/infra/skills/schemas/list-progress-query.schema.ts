import z from 'zod';
import type { ListSkillProgressQueryDto } from '../dtos';

export const listSkillProgressQuerySchema = z
	.object({
		limit: z.coerce.number().min(1).max(100).default(50),
		page: z.coerce.number().nonnegative().default(0),
	})
	.optional() satisfies z.ZodType<ListSkillProgressQueryDto | undefined>;
