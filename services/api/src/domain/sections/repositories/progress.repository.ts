import { LearningPathId } from '@/domain/learning-paths';
import type { SectionProgress } from '../progress.aggregate';
import type { SectionProgressId } from '../value-objects';
import { UserId } from '@/domain/common';

export type ListSectionProgressOptions = {
	options?: Partial<{
		limit: number;
		page: number;
	}>;
	where?: Partial<{
		userId: string;
		learningPathId: string;
	}>;
};

export interface ISectionProgressRepository {
	findById(id: SectionProgressId): Promise<SectionProgress | null>;

	findCurrent(
		id: LearningPathId,
		userId: UserId,
	): Promise<SectionProgress | null>;

	save(aggregate: SectionProgress): Promise<void>;

	remove(id: SectionProgressId): Promise<boolean>;

	list(options?: ListSectionProgressOptions): Promise<SectionProgress[]>;
}
