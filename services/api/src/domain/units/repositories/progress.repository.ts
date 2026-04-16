import type { UnitProgress } from '../progress.aggregate';
import type { UnitProgressId } from '../value-objects';

export type ListUnitProgressOptions = {
	options?: Partial<{
		limit: number;
		page: number;
	}>;
	where?: Partial<{
		userId: string;
		sectionId: string;
	}>;
};

export interface IUnitProgressRepository {
	findById(id: UnitProgressId): Promise<UnitProgress | null>;

	save(aggregate: UnitProgress): Promise<void>;

	remove(id: UnitProgressId): Promise<boolean>;

	list(options?: ListUnitProgressOptions): Promise<UnitProgress[]>;
}
