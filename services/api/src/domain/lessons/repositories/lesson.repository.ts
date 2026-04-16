import type { Lesson } from '../lesson.aggregate';
import type { LessonId } from '../value-objects/id.vo';

export type ListLessonsOptions = {
	options?: Partial<{
		limit: number;
		page: number;
	}>;
	where?: Partial<{
		unitId: string;
	}>;
};

export interface ILessonRepository {
	findById(id: LessonId): Promise<Lesson | null>;

	save(aggregate: Lesson): Promise<void>;

	remove(id: LessonId): Promise<boolean>;

	list(options?: ListLessonsOptions): Promise<Lesson[]>;
}
