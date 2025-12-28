import type { FindOneUnitCommand } from '@/app/units/commands';
import type { Unit } from '@/domain/units/entities';
import { UnitNotFoundException } from '@/domain/units/exceptions';
import type { IUnitsRepository } from '@/app/units/interfaces';

/**
 * @description This class responsibility is to find one unit. It uses units repository for retrieving unit from a data source. unitsRepository in injected to this class via dependency injection and dependency inversion techniques by using IUnitsRepository interface.
 */
export class FindOneUnitUseCase {
	constructor(private readonly unitsRepository: IUnitsRepository) {}

	/**
	 *
	 * @param command object with data for finding one unit
	 * @returns found unit
	 * @throws UnitNotFoundException if unit was not found
	 */
	async execute(command: FindOneUnitCommand): Promise<Unit> {
		const unit = await this.unitsRepository.findOne(command);

		if (!unit) {
			throw new UnitNotFoundException(command.where.id);
		}

		return unit;
	}
}
