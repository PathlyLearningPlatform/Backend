import { ActivityDto } from '../activities/dtos';
import { ExerciseDifficulty } from '@/domain/exercises';

export interface ExerciseDto extends ActivityDto {
	difficulty: ExerciseDifficulty;
}
