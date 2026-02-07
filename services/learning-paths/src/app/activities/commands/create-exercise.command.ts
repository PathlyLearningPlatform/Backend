import type { ExerciseCreateFields } from '@/domain/activities/entities';

export type CreateExerciseCommand = Omit<ExerciseCreateFields, 'type' | 'id'>;
