import z from 'zod';

export const getPrerequisiteGraphSchema = z.object({
	parentSkillid: z.uuid().optional(),
});
