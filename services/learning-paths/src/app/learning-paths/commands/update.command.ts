import type { LearningPathUpdateFields } from '@/domain/learning-paths/entities';

export type UpdateLearningPathCommand = {
	where: {
		id: string;
	};
	fields?: LearningPathUpdateFields;
};
