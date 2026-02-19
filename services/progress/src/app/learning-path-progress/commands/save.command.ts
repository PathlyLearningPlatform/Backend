import { LearningPathProgressCreateFields } from '@/domain/learning-path-progress/entities';

export type SaveLearningPathProgressCommand = Omit<
	LearningPathProgressCreateFields,
	'id'
>;
