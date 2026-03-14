import { LessonProgress } from '../lesson-progress.aggregate';
import { LessonProgressId } from '../value-objects';

export interface ILessonProgressRepository {
	load(id: LessonProgressId): Promise<LessonProgress>;

	save(aggregate: LessonProgress): Promise<void>;

	remove(id: LessonProgressId): Promise<boolean>;
}
