import {
	ActivityUpdateFields,
	ExerciseUpdateFields,
} from '@/domain/activities/entities';

export type UpdateExerciseCommand = {
	where: {
		activityId: string;
	};
	fields?: ExerciseUpdateFields & ActivityUpdateFields;
};
