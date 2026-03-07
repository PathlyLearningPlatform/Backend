import { Unit } from '../unit.aggregate';
import { UnitId } from '../value-objects/id.vo';

export interface IUnitRepository {
	load(id: UnitId): Promise<Unit | null>;

	save(aggregate: Unit): Promise<void>;

	remove(id: UnitId): Promise<boolean>;
}
