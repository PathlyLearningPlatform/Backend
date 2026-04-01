import z from 'zod';

export const getPrerequisiteGraphSchema = z.object({
	parentSkillId: z.uuid().optional(),
});
