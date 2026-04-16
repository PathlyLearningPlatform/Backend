import { SectionId } from '@/domain/sections';
import type { Unit } from '../unit.aggregate';
import type { UnitId } from '../value-objects/id.vo';
import { Order } from '@/domain/common';

export type ListUnitsOptions = {
	options?: Partial<{
		limit: number;
		page: number;
	}>;
	where?: Partial<{
		sectionId: string;
	}>;
};

export interface IUnitRepository {
	findById(id: UnitId): Promise<Unit | null>;

	findBySectionIdAndOrder(
		sectionId: SectionId,
		order: Order,
	): Promise<Unit | null>;

	save(aggregate: Unit): Promise<void>;

	remove(id: UnitId): Promise<boolean>;

	list(options?: ListUnitsOptions): Promise<Unit[]>;
}
