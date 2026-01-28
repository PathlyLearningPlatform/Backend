import type { ActivityCreateProps } from '@/domain/activities/entities';

export type CreateQuizCommand = Omit<ActivityCreateProps, 'type' | 'id'>;
