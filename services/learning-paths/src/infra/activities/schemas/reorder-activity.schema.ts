import { z } from "zod";

export const reorderActivitySchema = z
	.object({
		activityId: z.uuid(),
		order: z.int32().nonnegative(),
	})
	.strict();
