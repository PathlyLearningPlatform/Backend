import { ExerciseDifficulty } from '@/domain/activities/enums';

export type CreateExerciseCommand = {
	name: string;
	description?: string | null;
	lessonId: string;
	order: number;
	difficulty: ExerciseDifficulty;
};
