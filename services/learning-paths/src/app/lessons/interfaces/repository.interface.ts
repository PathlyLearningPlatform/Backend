import type { Lesson, LessonQuery } from '@/domain/lessons/entities';

export interface ILessonsRepository {
	find(query?: LessonQuery): Promise<Lesson[]>;

	findOne(id: string): Promise<Lesson | null>;

	save(entity: Lesson): Promise<void>;

	remove(id: string): Promise<boolean>;
}
