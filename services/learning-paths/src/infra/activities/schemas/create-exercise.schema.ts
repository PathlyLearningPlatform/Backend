import { emptyStringToNull } from "@pathly-backend/common/index.js";
import { z } from "zod";
import { clientExerciseDifficultyToDomain } from "../helpers";
import {
	descriptionSchema,
	difficultySchema,
	lessonIdSchema,
	nameSchema,
} from "./fields.schema";

export const createExerciseSchema = z
	.object({
		name: nameSchema,
		description: z.preprocess(
			emptyStringToNull,
			descriptionSchema.optional().default(null),
		),
		lessonId: lessonIdSchema,
		difficulty: z.preprocess(
			clientExerciseDifficultyToDomain,
			difficultySchema,
		),
	})
	.strict();
