import { nullToEmptyString } from '@pathly-backend/common';
import type {
	Activity as ClientActivity,
	Article as ClientArticle,
	Exercise as ClientExercise,
	Quiz as ClientQuiz,
	Question as ClientQuestion,
} from '@pathly-backend/contracts/learning-paths/v1/activities.js';
import type {
	Activity,
	Article,
	Exercise,
	Quiz,
} from '@/domain/activities/entities';
import {
	activityTypeToClient,
	exerciseDifficultyToClient,
} from './enums.helper';
import { Question } from '@/domain/activities/entities/question.entity';

export function activityEntityToClient(entity: Activity): ClientActivity {
	return {
		id: entity.id,
		lessonId: entity.lessonId,
		name: entity.name,
		order: entity.order,
		description: nullToEmptyString(entity.description),
		type: activityTypeToClient(entity.type),
		updatedAt: entity.updatedAt === null ? '' : entity.updatedAt.toISOString(),
		createdAt: entity.createdAt.toISOString(),
	};
}

export function articleEntityToClient(entity: Article): ClientArticle {
	return { ...activityEntityToClient(entity), ref: entity.ref };
}

export function exerciseEntityToClient(entity: Exercise): ClientExercise {
	return {
		...activityEntityToClient(entity),
		difficulty: exerciseDifficultyToClient(entity.difficulty),
	};
}

export function quizEntityToClient(entity: Quiz): ClientQuiz {
	return {
		...activityEntityToClient(entity),
		nextQuestionOrder: entity.nextQuestionOrder,
		questions: entity.questions.map((q) => {
			return {
				id: q.id,
				quizId: q.quizId,
				correctAnswer: q.correctAnswer,
				content: q.content,
				order: q.order,
			};
		}),
	};
}

export function questionEntityToClient(entity: Question): ClientQuestion {
	return {
		content: entity.content,
		correctAnswer: entity.correctAnswer,
		id: entity.id,
		quizId: entity.quizId,
		order: entity.order,
	};
}
