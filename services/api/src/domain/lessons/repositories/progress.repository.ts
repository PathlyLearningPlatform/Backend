import type { LessonProgress } from "../progress.aggregate";
import type { LessonProgressId } from "../value-objects";

export interface ILessonProgressRepository {
	load(id: LessonProgressId): Promise<LessonProgress | null>;

	save(aggregate: LessonProgress): Promise<void>;

	remove(id: LessonProgressId): Promise<boolean>;
}
