import { LearningPathProgressUpdateFields } from '@/domain/learning-path-progress/entities';

export type UpdateLearningPathProgressCommand = {
	where: {
		id: string;
	};
	fields?: LearningPathProgressUpdateFields;
};
