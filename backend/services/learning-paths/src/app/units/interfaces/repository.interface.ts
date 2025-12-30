import type { Unit } from '@domain/units/entities';
import type {
	CreateUnitCommand,
	FindOneUnitCommand,
	FindUnitsCommand,
	RemoveUnitCommand,
	UpdateUnitCommand,
} from '../commands';

export interface IUnitsRepository {
	find(command: FindUnitsCommand): Promise<Unit[]>;

	findOne(command: FindOneUnitCommand): Promise<Unit | null>;

	create(command: CreateUnitCommand): Promise<Unit>;

	update(command: UpdateUnitCommand): Promise<Unit | null>;

	remove(command: RemoveUnitCommand): Promise<Unit | null>;
}
