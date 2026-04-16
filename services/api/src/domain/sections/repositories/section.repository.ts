import type { Section } from '../section.aggregate';
import type { SectionId } from '../value-objects/id.vo';

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

	save(aggregate: Section): Promise<void>;

	remove(id: SectionId): Promise<boolean>;

	list(options?: ListSectionsOptions): Promise<Section[]>;
}
