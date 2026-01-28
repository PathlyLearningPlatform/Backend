import type { ExerciseCreateProps } from '@/domain/activities/entities';

export type CreateExerciseCommand = Omit<ExerciseCreateProps, 'type' | 'id'>;
