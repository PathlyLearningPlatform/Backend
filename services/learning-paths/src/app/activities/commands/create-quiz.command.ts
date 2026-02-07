import type { ActivityCreateFields } from '@/domain/activities/entities';

export type CreateQuizCommand = Omit<ActivityCreateFields, 'type' | 'id'>;
