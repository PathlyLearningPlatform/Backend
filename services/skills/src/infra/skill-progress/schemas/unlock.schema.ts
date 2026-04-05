import z from 'zod';

export const unlockSkillSchema = z.object({
	skillId: z.uuid(),
	userId: z.uuid(),
});
