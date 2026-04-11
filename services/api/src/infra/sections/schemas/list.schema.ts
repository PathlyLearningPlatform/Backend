import { z } from "zod";
import { SectionsApiConstraints } from "../enums";

export const listSectionsSchema = z
	.object({
		options: z
			.object({
				limit: z
					.int32()
					.min(SectionsApiConstraints.MIN_LIMIT)
					.max(SectionsApiConstraints.MAX_LIMIT)
					.optional()
					.default(SectionsApiConstraints.DEFAULT_LIMIT),
				page: z
					.int32()
					.nonnegative()
					.optional()
					.default(SectionsApiConstraints.DEFAULT_PAGE),
			})
			.strict()
			.optional(),
		where: z
			.object({
				learningPathId: z.uuid().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
