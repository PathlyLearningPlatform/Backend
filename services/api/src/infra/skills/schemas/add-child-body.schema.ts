import z from 'zod';
import type { AddChildBodyDto } from '../dtos';
import { skillIdSchema } from './fields.schema';

export const addChildBodySchema = z.object({
	parentSkillId: skillIdSchema,
	childSkillId: skillIdSchema,
}) satisfies z.ZodType<AddChildBodyDto>;
