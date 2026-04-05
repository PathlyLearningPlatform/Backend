import z from 'zod';

export const findOneSkillProgressForUserSchema = z.object({
	userId: z.uuid(),
	skillId: z.uuid(),
});
