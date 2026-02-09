import type { UpdateUnitCommand } from '@/app/units/commands';
import type { IUnitsRepository } from '@/app/units/interfaces';
import type { Unit } from '@/domain/units/entities';
import { UnitNotFoundException } from '@/domain/units/exceptions';

export class UpdateUnitUseCase {
	constructor(private readonly unitsRepository: IUnitsRepository) {}

	async execute(command: UpdateUnitCommand): Promise<Unit> {
		const unit = await this.unitsRepository.findOne(command.where.id);

		if (!unit) {
			throw new UnitNotFoundException(command.where.id);
		}

		unit.update({
			description: command.fields?.description,
			name: command.fields?.name,
			order: command.fields?.order,
		});

		await this.unitsRepository.save(unit);

		return unit;
	}
}
