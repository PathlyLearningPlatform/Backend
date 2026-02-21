import { LearningPathProgressCreateFields } from '@/domain/learning-path-progress/entities';

export type CreateLearningPathProgressCommand = Omit<
	LearningPathProgressCreateFields,
	'id'
>;
