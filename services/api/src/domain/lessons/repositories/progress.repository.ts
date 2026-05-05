import { UserId } from '@/domain/common';
import { UnitId } from '@/domain/units';
import type { LessonProgress } from '../progress.aggregate';
import type { LessonProgressId } from '../value-objects';

export type ListLessonProgressOptions = {
	options?: Partial<{
		limit: number;
		page: number;
	}>;
	where?: Partial<{
		userId: string;
		unitId: string;
	}>;
};

export interface ILessonProgressRepository {
	findById(id: LessonProgressId): Promise<LessonProgress | null>;

	findCurrent(id: UnitId, userId: UserId): Promise<LessonProgress | null>;

	save(aggregate: LessonProgress): Promise<void>;

	remove(id: LessonProgressId): Promise<boolean>;

	list(options?: ListLessonProgressOptions): Promise<LessonProgress[]>;
}
