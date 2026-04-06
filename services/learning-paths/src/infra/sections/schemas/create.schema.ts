import { emptyStringToNull } from "@pathly-backend/common/index.js";
import { z } from "zod";
import {
	descriptionSchema,
	learningPathIdSchema,
	nameSchema,
} from "./fields.schema";

export const createSectionSchema = z
	.object({
		name: nameSchema,
		description: z.preprocess(
			emptyStringToNull,
			descriptionSchema.optional().default(null),
		),
		learningPathId: learningPathIdSchema,
	})
	.strict();
