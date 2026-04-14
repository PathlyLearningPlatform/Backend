import z from 'zod';
import type { AddSkillNextStepBodyDto } from '../dtos';
import { skillIdSchema } from './fields.schema';

export const addNextStepBodySchema = z.object({
	prerequisiteSkillId: skillIdSchema,
	targetSkillId: skillIdSchema,
}) satisfies z.ZodType<AddSkillNextStepBodyDto>;
