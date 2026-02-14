import { ExerciseDifficulty as ClientExerciseDifficulty } from '@pathly-backend/contracts/learning-paths/v1/activities.js'
import { ExerciseDifficulty } from '../enums'

export function exerciseDifficultyToClient(
	difficulty: ExerciseDifficulty,
): ClientExerciseDifficulty {
	switch (difficulty) {
		case ExerciseDifficulty.EASY:
			return ClientExerciseDifficulty.EASY
		case ExerciseDifficulty.MEDIUM:
			return ClientExerciseDifficulty.MEDIUM
		case ExerciseDifficulty.HARD:
			return ClientExerciseDifficulty.HARD
	}
}
