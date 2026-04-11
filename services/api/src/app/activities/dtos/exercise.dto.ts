import type { ExerciseDifficulty } from "@/domain/activities/exercises/value-objects";
import type { ActivityDto } from "./activity.dto";

export interface ExerciseDto extends ActivityDto {
	difficulty: ExerciseDifficulty;
}
