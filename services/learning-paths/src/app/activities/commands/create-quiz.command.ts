import {
	ActivityCreateFields,
	QuizCreateFields,
} from '@/domain/activities/entities';

export type CreateQuizCommand = Omit<
	QuizCreateFields & ActivityCreateFields,
	'type' | 'activityId'
>;
