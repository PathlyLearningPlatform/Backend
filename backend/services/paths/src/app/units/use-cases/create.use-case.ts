import { SectionNotFoundException } from '@/domain/sections/exceptions';
import { ISectionsRepository } from '@/domain/sections/interfaces';
import type { CreateUnitCommand } from '@/domain/units/commands';
import type { Unit } from '@/domain/units/entities';
import type { IUnitsRepository } from '@/domain/units/interfaces';

/**
 * @description This class responsibility is to create a unit. It uses units repository for saving units to a data source. unitsRepository in injected to this class via dependency injection and dependency inversion techniques by using IUnitsRepository interface.
 */
export class CreateUnitUseCase {
	constructor(
		private readonly unitsRepository: IUnitsRepository,
		private readonly sectionsRepository: ISectionsRepository,
	) {}

	/**
	 * @param command object with data for unit creation
	 * @returns created unit
	 * @description this function saves unit to a data source and returns it
	 * @throws {SectionNotFoundException}
	 */
	async execute(command: CreateUnitCommand): Promise<Unit> {
		const section = await this.sectionsRepository.findOne({
			where: { id: command.sectionId },
		});

		if (!section) {
			throw new SectionNotFoundException(command.sectionId);
		}

		const createdUnit = await this.unitsRepository.create(command);

		return createdUnit;
	}
}
