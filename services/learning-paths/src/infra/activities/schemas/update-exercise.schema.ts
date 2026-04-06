import { emptyStringToNull } from "@pathly-backend/common/index.js";
import { z } from "zod";
import {
	descriptionSchema,
	difficultySchema,
	nameSchema,
} from "./fields.schema";

export const updateExerciseSchema = z
	.object({
		where: z
			.object({
				activityId: z.uuid(),
			})
			.strict(),
		fields: z
			.object({
				name: nameSchema.optional(),
				description: z.preprocess(
					emptyStringToNull,
					descriptionSchema.optional(),
				),
				difficulty: difficultySchema.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
