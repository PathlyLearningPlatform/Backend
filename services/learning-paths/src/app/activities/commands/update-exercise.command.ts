import { ExerciseDifficulty } from '@/domain/activities/enums';

export type UpdateExerciseCommand = {
	where: {
		activityId: string;
	};
	fields?: {
		name?: string;
		description?: string | null;
		order?: number;
		lessonId?: string;
		difficulty?: ExerciseDifficulty;
	};
};
