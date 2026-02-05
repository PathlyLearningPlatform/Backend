import type { FindUnitsCommand } from '@/app/units/commands';
import type { IUnitsRepository } from '@/app/units/interfaces';
import type { Unit } from '@/domain/units/entities';

export class FindUnitsUseCase {
	constructor(private readonly unitsRepository: IUnitsRepository) {}

	async execute(command: FindUnitsCommand): Promise<Unit[]> {
		return this.unitsRepository.find(command);
	}
}
