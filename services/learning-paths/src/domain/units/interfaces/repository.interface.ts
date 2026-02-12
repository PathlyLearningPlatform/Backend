import type { Unit, UnitQuery } from '@/domain/units/entities';

export interface IUnitsRepository {
	find(query?: UnitQuery): Promise<Unit[]>;

	findOne(id: string): Promise<Unit | null>;

	save(entity: Unit): Promise<void>;

	remove(id: string): Promise<boolean>;
}
