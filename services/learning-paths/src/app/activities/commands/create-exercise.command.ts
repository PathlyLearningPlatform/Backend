import {
	ActivityCreateFields,
	ExerciseCreateFields,
} from '@/domain/activities/entities';

export type CreateExerciseCommand = Omit<
	ExerciseCreateFields & ActivityCreateFields,
	'type' | 'activityId'
>;
