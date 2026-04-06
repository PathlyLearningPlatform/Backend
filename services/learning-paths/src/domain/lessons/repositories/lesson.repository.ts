import type { Lesson } from "../lesson.aggregate";
import type { LessonId } from "../value-objects/id.vo";

export interface ILessonRepository {
	load(id: LessonId): Promise<Lesson | null>;

	save(aggregate: Lesson): Promise<void>;

	remove(id: LessonId): Promise<boolean>;
}
