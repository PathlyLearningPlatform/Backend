import type { SectionProgress } from '../progress.aggregate';
import type { SectionProgressId } from '../value-objects';

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

	save(aggregate: SectionProgress): Promise<void>;

	remove(id: SectionProgressId): Promise<boolean>;

	list(options?: ListSectionProgressOptions): Promise<SectionProgress[]>;
}
