import { ActivityType } from '@/domain/activities';
import { ExerciseDifficulty } from '@/domain/exercises';

export interface ExerciseDto {
	id: string;
	lessonId: string;
	name: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	type: ActivityType;
	order: number;
	difficulty: ExerciseDifficulty;
}
