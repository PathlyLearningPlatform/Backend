import z from 'zod';
import type { GetPrerequisiteGraphQueryDto } from '../dtos';
import { skillIdSchema } from './fields.schema';

export const getPrerequisiteGraphQuerySchema = z
	.object({
		parentSkillId: skillIdSchema.optional(),
	})
	.optional() satisfies z.ZodType<GetPrerequisiteGraphQueryDto | undefined>;
