import type { ExerciseUpdateProps } from '@/domain/activities/entities';

export type UpdateExerciseCommand = {
	where: {
		activityId: string;
	};
	fields?: ExerciseUpdateProps;
};
