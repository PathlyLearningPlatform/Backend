import type { LearningPath } from '@/domain/learning-paths/entities';
import type { DbLearningPath } from '../types';

export function dbPathToEntity(db: DbLearningPath): LearningPath {
	return {
		...db,
		createdAt: db.createdAt.toISOString(),
		updatedAt: db.updatedAt.toISOString(),
	};
}
