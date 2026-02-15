import type { QuizCreateFields } from '@/domain/activities/entities';

export type CreateQuizCommand = Omit<QuizCreateFields, 'type' | 'id'>;
