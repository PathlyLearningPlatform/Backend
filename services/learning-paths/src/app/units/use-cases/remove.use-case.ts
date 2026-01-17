import type { RemoveUnitCommand } from '@/app/units/commands';
import type { IUnitsRepository } from '@/app/units/interfaces';
import type { Unit } from '@/domain/units/entities';
import {
	UnitCannotBeRemovedException,
	UnitNotFoundException,
} from '@/domain/units/exceptions';
import { InvalidReferenceException } from '@pathly-backend/common/index.js';

/**
 * @description This class responsibility is to remove a unit. It uses units repository for removing unit from a data source. unitsRepository in injected to this class via dependency injection and dependency inversion techniques by using IUnitsRepository interface.
 */
export class RemoveUnitUseCase {
	constructor(private readonly unitsRepository: IUnitsRepository) {}

	/**
	 *
	 * @param command object with data for removing unit
	 * @returns removed unit
	 * @throws UnitNotFoundException if unit was not found
	 */
	async execute(command: RemoveUnitCommand): Promise<Unit> {
		try {
			const unit = await this.unitsRepository.remove(command);

			if (!unit) {
				throw new UnitNotFoundException(command.where.id);
			}

			return unit;
		} catch (err) {
			if (err instanceof InvalidReferenceException) {
				throw new UnitCannotBeRemovedException(command.where.id);
			}

			throw err;
		}
	}
}
