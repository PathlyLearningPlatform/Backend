import type { IUnitsRepository } from '@/app/units/interfaces';
import type { Unit } from '@/domain/units/entities';
import { UnitNotFoundException } from '@/domain/units/exceptions';

export class FindOneUnitUseCase {
	constructor(private readonly unitsRepository: IUnitsRepository) {}

	async execute(id: string): Promise<Unit> {
		const unit = await this.unitsRepository.findOne(id);

		if (!unit) {
			throw new UnitNotFoundException(id);
		}

		return unit;
	}
}
