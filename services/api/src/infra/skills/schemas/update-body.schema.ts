import z from 'zod';
import type { UpdateSkillBodyDto } from '../dtos';
import { skillNameSchema } from './fields.schema';

export const updateSkillBodySchema = z.object({
	name: skillNameSchema.optional(),
}) satisfies z.ZodType<UpdateSkillBodyDto>;
