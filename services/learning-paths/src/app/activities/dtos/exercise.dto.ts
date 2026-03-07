import { ExerciseDifficulty } from '@/domain/activities/exercises/value-objects';
import { ActivityDto } from './activity.dto';

export interface ExerciseDto extends ActivityDto {
	difficulty: ExerciseDifficulty;
}
