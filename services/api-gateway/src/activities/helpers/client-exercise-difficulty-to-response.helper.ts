import { ExerciseDifficulty as ClientExerciseDifficulty } from '@pathly-backend/contracts/learning-paths/v1/activities.js'
import { ExerciseDifficulty } from '../enums'

export function clientExerciseDifficultyToResponse(
	client: ClientExerciseDifficulty,
): ExerciseDifficulty {
	switch (client) {
		case ClientExerciseDifficulty.EASY:
			return ExerciseDifficulty.EASY
		case ClientExerciseDifficulty.MEDIUM:
			return ExerciseDifficulty.MEDIUM
		case ClientExerciseDifficulty.HARD:
			return ExerciseDifficulty.HARD
	}
}
