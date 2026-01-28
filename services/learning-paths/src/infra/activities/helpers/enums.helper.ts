import {
	ActivityType as ClientActivityType,
	ExerciseDifficulty as ClientExerciseDifficulty,
} from '@pathly-backend/contracts/learning-paths/v1/activities.js';
import { ActivityType, ExerciseDifficulty } from '@/domain/activities/enums';

export function clientActivityTypeToDomain(
	client: ClientActivityType,
): ActivityType {
	switch (client) {
		case ClientActivityType.ARTICLE:
			return ActivityType.ARTICLE;
		case ClientActivityType.EXERCISE:
			return ActivityType.EXERCISE;
		case ClientActivityType.QUIZ:
			return ActivityType.QUIZ;
	}
}

export function activityTypeToClient(domain: ActivityType): ClientActivityType {
	switch (domain) {
		case ActivityType.ARTICLE:
			return ClientActivityType.ARTICLE;
		case ActivityType.EXERCISE:
			return ClientActivityType.EXERCISE;
		case ActivityType.QUIZ:
			return ClientActivityType.QUIZ;
	}
}

export function clientExerciseDifficultyToDomain(
	client: ClientExerciseDifficulty,
): ExerciseDifficulty {
	switch (client) {
		case ClientExerciseDifficulty.EASY:
			return ExerciseDifficulty.EASY;
		case ClientExerciseDifficulty.MEDIUM:
			return ExerciseDifficulty.MEDIUM;
		case ClientExerciseDifficulty.HARD:
			return ExerciseDifficulty.HARD;
	}
}

export function exerciseDifficultyToClient(
	domain: ExerciseDifficulty,
): ClientExerciseDifficulty {
	switch (domain) {
		case ExerciseDifficulty.EASY:
			return ClientExerciseDifficulty.EASY;
		case ExerciseDifficulty.MEDIUM:
			return ClientExerciseDifficulty.MEDIUM;
		case ExerciseDifficulty.HARD:
			return ClientExerciseDifficulty.HARD;
	}
}
