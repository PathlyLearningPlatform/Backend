import { Lesson } from '@/domain/lessons/entities';
import type { DbLesson } from '../types';

export function dbLessonToEntity(db: DbLesson): Lesson {
	return new Lesson({
		id: db.id,
		unitId: db.unitId,
		createdAt: db.createdAt,
		updatedAt: db.updatedAt,
		name: db.name,
		description: db.description,
		order: db.order,
	});
}
