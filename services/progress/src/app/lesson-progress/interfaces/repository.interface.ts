import { LessonProgress } from '@/domain/lesson-progress/entities/lesson-progress.entity';
import { LessonProgressFilter } from '../types';
import { DomainEvent } from '@/domain/common';

export interface ILessonProgressRepository {
	list(filter?: LessonProgressFilter): Promise<LessonProgress[]>;

	findById(id: string): Promise<LessonProgress | null>;
	findOneForUser(
		lessonId: string,
		userId: string,
	): Promise<LessonProgress | null>;

	save(entity: LessonProgress): Promise<DomainEvent[]>;

	removeById(id: string): Promise<boolean>;
}
