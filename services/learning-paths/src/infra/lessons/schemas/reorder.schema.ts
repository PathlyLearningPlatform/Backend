import { z } from "zod";

export const reorderLessonSchema = z
	.object({
		lessonId: z.uuid(),
		order: z.int32().nonnegative(),
	})
	.strict();
