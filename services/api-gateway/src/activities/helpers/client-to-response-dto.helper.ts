import {
	emptyStringToNull,
	nullToEmptyString,
} from '@pathly-backend/common/index.js'
import type {
	Activity as ClientActivity,
	Article as ClientArticle,
	Exercise as ClientExercise,
	Quiz as ClientQuiz,
	Question as ClientQuestion,
} from '@pathly-backend/contracts/learning-paths/v1/activities.js'
import type {
	ActivityResponseDto,
	ArticleResponseDto,
	ExerciseResponseDto,
	QuestionResponseDto,
	QuizResponseDto,
} from '../dtos'
import { clientActivityTypeToResponse } from './client-activity-type-to-response.helper'
import { clientExerciseDifficultyToResponse } from './client-exercise-difficulty-to-response.helper'

export function clientActivityToResponseDto(
	client: ClientActivity,
): ActivityResponseDto {
	return {
		id: client.id,
		lessonId: client.lessonId,
		createdAt: client.createdAt,
		name: client.name,
		order: client.order,
		type: clientActivityTypeToResponse(client.type),
		description: emptyStringToNull(client.description),
		updatedAt: emptyStringToNull(client.updatedAt),
	}
}

export function clientArticleToResponseDto(
	client: ClientArticle,
): ArticleResponseDto {
	return {
		id: client.id,
		lessonId: client.lessonId,
		createdAt: client.createdAt,
		name: client.name,
		order: client.order,
		ref: client.ref,
		type: clientActivityTypeToResponse(client.type),
		description: emptyStringToNull(client.description),
		updatedAt: emptyStringToNull(client.updatedAt),
	}
}

export function clientExerciseToResponseDto(
	client: ClientExercise,
): ExerciseResponseDto {
	return {
		id: client.id,
		lessonId: client.lessonId,
		createdAt: client.createdAt,
		name: client.name,
		order: client.order,
		difficulty: clientExerciseDifficultyToResponse(client.difficulty),
		type: clientActivityTypeToResponse(client.type),
		description: emptyStringToNull(client.description),
		updatedAt: emptyStringToNull(client.updatedAt),
	}
}

export function clientQuestionToResponseDto(
	client: ClientQuestion,
): QuestionResponseDto {
	return {
		content: client.content,
		correctAnswer: client.correctAnswer,
		id: client.id,
		quizId: client.quizId,
	}
}

export function clientQuizToResponseDto(client: ClientQuiz): QuizResponseDto {
	return {
		id: client.id,
		lessonId: client.lessonId,
		createdAt: client.createdAt,
		name: client.name,
		order: client.order,
		questions: client.questions.map(clientQuestionToResponseDto),
		type: clientActivityTypeToResponse(client.type),
		description: emptyStringToNull(client.description),
		updatedAt: emptyStringToNull(client.updatedAt),
	}
}
