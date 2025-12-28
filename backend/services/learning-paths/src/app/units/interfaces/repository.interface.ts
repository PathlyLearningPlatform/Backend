import {
	FindOneUnitCommand,
	FindUnitsCommand,
	CreateUnitCommand,
	RemoveUnitCommand,
	UpdateUnitCommand,
} from '../commands';
import { Unit } from '@domain/units/entities';

export interface IUnitsRepository {
	find(command: FindUnitsCommand): Promise<Unit[]>;

	findOne(command: FindOneUnitCommand): Promise<Unit | null>;

	create(command: CreateUnitCommand): Promise<Unit>;

	update(command: UpdateUnitCommand): Promise<Unit | null>;

	remove(command: RemoveUnitCommand): Promise<Unit | null>;
}
