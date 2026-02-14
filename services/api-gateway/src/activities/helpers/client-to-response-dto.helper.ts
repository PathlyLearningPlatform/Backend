import {
	emptyStringToNull,
	nullToEmptyString,
} from '@pathly-backend/common/index.js'
import type {
	Activity as ClientActivity,
	Article as ClientArticle,
	Exercise as ClientExercise,
	Quiz as ClientQuiz,
} from '@pathly-backend/contracts/learning-paths/v1/activities.js'
import type {
	ActivityResponseDto,
	ArticleResponseDto,
	ExerciseResponseDto,
	QuizResponseDto,
} from '../dtos'
import { clientActivityTypeToResponse } from './client-activity-type-to-response.helper'
import { clientExerciseDifficultyToResponse } from './client-exercise-difficulty-to-response.helper'

export function clientActivityToResponseDto(
	client: ClientActivity,
): ActivityResponseDto {
	return {
		...client,
		type: clientActivityTypeToResponse(client.type),
		description: emptyStringToNull(client.description),
		updatedAt: emptyStringToNull(client.updatedAt),
	}
}

export function clientArticleToResponseDto(
	client: ClientArticle,
): ArticleResponseDto {
	return {
		...client,
		type: clientActivityTypeToResponse(client.type),
		description: emptyStringToNull(client.description),
		updatedAt: emptyStringToNull(client.updatedAt),
	}
}

export function clientExerciseToResponseDto(
	client: ClientExercise,
): ExerciseResponseDto {
	return {
		...client,
		difficulty: clientExerciseDifficultyToResponse(client.difficulty),
		type: clientActivityTypeToResponse(client.type),
		description: emptyStringToNull(client.description),
		updatedAt: emptyStringToNull(client.updatedAt),
	}
}

export function clientQuizToResponseDto(client: ClientQuiz): QuizResponseDto {
	return {
		...client,
		type: clientActivityTypeToResponse(client.type),
		description: emptyStringToNull(client.description),
		updatedAt: emptyStringToNull(client.updatedAt),
	}
}
