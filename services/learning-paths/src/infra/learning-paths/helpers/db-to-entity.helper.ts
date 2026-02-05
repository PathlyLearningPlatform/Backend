import { LearningPath } from '@/domain/learning-paths/entities';
import type { DbLearningPath } from '../types';

export function dbLearningPathToEntity(db: DbLearningPath): LearningPath {
	return new LearningPath({
		id: db.id,
		createdAt: db.createdAt,
		updatedAt: db.updatedAt,
		description: db.description,
		name: db.name,
	});
}
