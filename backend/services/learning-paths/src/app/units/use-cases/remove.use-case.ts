import type { RemoveUnitCommand } from '@/app/units/commands';
import type { IUnitsRepository } from '@/app/units/interfaces';
import type { Unit } from '@/domain/units/entities';
import { UnitNotFoundException } from '@/domain/units/exceptions';

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
		const unit = await this.unitsRepository.remove(command);

		if (!unit) {
			throw new UnitNotFoundException(command.where.id);
		}

		return unit;
	}
}
