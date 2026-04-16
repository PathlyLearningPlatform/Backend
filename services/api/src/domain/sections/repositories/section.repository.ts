import { LearningPathId } from '@/domain/learning-paths';
import type { Section } from '../section.aggregate';
import type { SectionId } from '../value-objects/id.vo';
import { Order } from '@/domain/common';

export type ListSectionsOptions = {
	options?: Partial<{
		limit: number;
		page: number;
	}>;
	where?: Partial<{
		learningPathId: string;
	}>;
};

export interface ISectionRepository {
	findById(id: SectionId): Promise<Section | null>;

	findByLearningPathIdAndOrder(
		learningPathId: LearningPathId,
		order: Order,
	): Promise<Section | null>;

	save(aggregate: Section): Promise<void>;

	remove(id: SectionId): Promise<boolean>;

	list(options?: ListSectionsOptions): Promise<Section[]>;
}
