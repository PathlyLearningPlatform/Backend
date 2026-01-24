import {
	ActivityUpdateFields,
	QuizUpdateFields,
} from '@/domain/activities/entities';

export type UpdateQuizCommand = {
	where: {
		activityId: string;
	};
	fields?: QuizUpdateFields & ActivityUpdateFields;
};
