import z from 'zod';
import type { CreateSkillBodyDto } from '../dtos';
import { skillIdSchema, skillNameSchema } from './fields.schema';

export const createSkillBodySchema = z.object({
	name: skillNameSchema,
	parentId: skillIdSchema.nullable().optional(),
}) satisfies z.ZodType<CreateSkillBodyDto>;
