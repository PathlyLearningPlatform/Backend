import type { ActivityProgress as ClientActivityProgress } from '@pathly-backend/contracts/learning_paths/v1/activities.js';
import {
	type Activity as ClientActivity,
	ActivityType as ClientActivityType,
	type Article as ClientArticle,
	type Exercise as ClientExercise,
	ExerciseDifficulty as ClientExerciseDifficulty,
	type Question as ClientQuestion,
	type Quiz as ClientQuiz,
} from '@pathly-backend/contracts/learning-paths/v1/activities.js';
import type {
	ActivityDto,
	ActivityProgressDto,
	ArticleDto,
	ExerciseDto,
	QuestionDto,
	QuizDto,
	QuizWithoutQuestionsDto,
} from '@/app/activities/dtos';
import { ExerciseDifficulty } from '@/domain/activities/exercises/value-objects';
import { ActivityType } from '@/domain/activities/value-objects';

export function domainActivityTypeToClient(
	domain: ActivityType,
): ClientActivityType {
	switch (domain) {
		case ActivityType.ARTICLE:
			return ClientActivityType.ARTICLE;
		case ActivityType.QUIZ:
			return ClientActivityType.QUIZ;
		case ActivityType.EXERCISE:
			return ClientActivityType.EXERCISE;
	}
}

export function domainExerciseDifficultyToClient(
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

export function activityDtoToClient(dto: ActivityDto): ClientActivity {
	return {
		id: dto.id,
		createdAt: dto.createdAt.toISOString(),
		updatedAt: dto.updatedAt?.toISOString() ?? '',
		name: dto.name,
		description: dto.description ?? '',
		order: dto.order,
		lessonId: dto.lessonId,
		type: domainActivityTypeToClient(dto.type),
	};
}

export function articleDtoToClient(dto: ArticleDto): ClientArticle {
	return {
		...activityDtoToClient(dto),
		ref: dto.ref,
	};
}

export function exerciseDtoToClient(dto: ExerciseDto): ClientExercise {
	return {
		...activityDtoToClient(dto),
		difficulty: domainExerciseDifficultyToClient(dto.difficulty),
	};
}

export function questionDtoToClient(dto: QuestionDto): ClientQuestion {
	return {
		id: dto.id,
		quizId: dto.quizId,
		content: dto.content,
		correctAnswer: dto.correctAnswer,
		order: 0,
	};
}

export function quizDtoToClient(dto: QuizDto): ClientQuiz {
	return {
		...activityDtoToClient(dto),
		questions: dto.questions.map(questionDtoToClient),
	};
}

export function quizWithoutQuestionsDtoToClient(
	dto: QuizWithoutQuestionsDto,
): ClientQuiz {
	return {
		...activityDtoToClient(dto),
		questions: [],
	};
}

export function activityProgressDtoToClient(
	dto: ActivityProgressDto,
): ClientActivityProgress {
	return {
		activityId: dto.activityId,
		userId: dto.userId,
		completedAt: dto.completedAt?.toISOString() ?? '',
		lessonId: dto.lessonId,
	};
}
