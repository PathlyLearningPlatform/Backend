import type { FindUnitsCommand } from '@/domain/units/commands';
import type { Unit } from '@/domain/units/entities';
import type { IUnitsRepository } from '@/domain/units/interfaces';

/**
 * @description This class responsibility is to find units. It uses units repository for retrieving units from a data source. unitsRepository in injected to this class via dependency injection and dependency inversion techniques by using IUnitsRepository interface.
 */
export class FindUnitsUseCase {
	constructor(private readonly unitsRepository: IUnitsRepository) {}

	/**
	 * @param command object with data for finding units
	 * @returns found units
	 * @description this function retrievies units from a data source using given command
	 */
	async execute(command: FindUnitsCommand): Promise<Unit[]> {
		return this.unitsRepository.find(command);
	}
}
