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
import { ActivityType } from '@/domain/activities/enums';
import {
	activityTypeToClient,
	exerciseDifficultyToClient,
} from './enums.helper';

export function articleEntityToClient(entity: Article): ClientArticle {
	return {
		...entity,
		description: nullToEmptyString(entity.description),
		type: activityTypeToClient(ActivityType.ARTICLE),
	};
}

export function exerciseEntityToClient(entity: Exercise): ClientExercise {
	return {
		...entity,
		description: nullToEmptyString(entity.description),
		type: activityTypeToClient(ActivityType.EXERCISE),
		difficulty: exerciseDifficultyToClient(entity.difficulty),
	};
}

export function quizEntityToClient(entity: Quiz): ClientQuiz {
	return {
		...entity,
		description: nullToEmptyString(entity.description),
		type: activityTypeToClient(ActivityType.QUIZ),
	};
}

export function activityEntityToClient(entity: Activity): ClientActivity {
	return {
		...entity,
		description: nullToEmptyString(entity.description),
		type: activityTypeToClient(entity.type),
	};
}
