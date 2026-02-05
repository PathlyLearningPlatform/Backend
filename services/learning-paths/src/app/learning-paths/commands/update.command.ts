import type { LearningPathUpdateProps } from '@/domain/learning-paths/entities';

export type UpdateLearningPathCommand = {
	where: {
		id: string;
	};
	fields?: LearningPathUpdateProps;
};
