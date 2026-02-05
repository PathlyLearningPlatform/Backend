import { nullToEmptyString } from '@pathly-backend/common';
import type {
	Activity as ClientActivity,
	Article as ClientArticle,
	Exercise as ClientExercise,
	Quiz as ClientQuiz,
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

export function activityEntityToClient(entity: Activity): ClientActivity {
	return {
		...entity,
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
	return { ...activityEntityToClient(entity) };
}
