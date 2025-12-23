import { SectionNotFoundException } from '@/domain/sections/exceptions';
import { ISectionsRepository } from '@/app/sections/interfaces';
import type { UpdateUnitCommand } from '@/app/units/commands';
import type { Unit } from '@/domain/units/entities';
import { UnitNotFoundException } from '@/domain/units/exceptions';
import type { IUnitsRepository } from '@/app/units/interfaces';

/**
 * @description This class responsibility is to update a unit. It uses units repository for updating units in a data source. unitsRepository in injected to this class via dependency injection and dependency inversion techniques by using IUnitsRepository interface.
 */
export class UpdateUnitUseCase {
	constructor(private readonly unitsRepository: IUnitsRepository) {}

	/**
	 *
	 * @param command object with data for updating unit
	 * @returns updated unit
	 * @throws
	 * {UnitNotFoundException} if unit was not found
	 */
	async execute(command: UpdateUnitCommand): Promise<Unit> {
		const updatedUnit = await this.unitsRepository.update(command);

		if (!updatedUnit) {
			throw new UnitNotFoundException(command.where.id);
		}

		return updatedUnit;
	}
}
