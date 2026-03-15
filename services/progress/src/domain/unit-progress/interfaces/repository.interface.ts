import { UnitProgress } from '../unit-progress.aggregate';
import { UnitProgressId } from '../value-objects';

export interface IUnitProgressRepository {
	load(id: UnitProgressId): Promise<UnitProgress | null>;

	save(aggregate: UnitProgress): Promise<void>;

	remove(id: UnitProgressId): Promise<boolean>;
}
