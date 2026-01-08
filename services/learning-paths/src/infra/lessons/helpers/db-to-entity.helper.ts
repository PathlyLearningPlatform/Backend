import type { Lesson } from '@/domain/lessons/entities';
import type { DbLesson } from '../types';

export function dbLessonToEntity(db: DbLesson): Lesson {
	return {
		...db,
		createdAt: db.createdAt.toISOString(),
		updatedAt: db.updatedAt.toISOString(),
	};
}
