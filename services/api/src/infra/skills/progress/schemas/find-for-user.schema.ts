import z from 'zod';

export const findSkillProgressForUserSchema = z.object({
	userId: z.uuid(),
});
