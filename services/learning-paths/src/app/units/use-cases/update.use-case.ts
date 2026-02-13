import type { UpdateUnitCommand } from '@/app/units/commands';
import type { IUnitsRepository } from '@domain/units/interfaces';
import type { Unit } from '@/domain/units/entities';
import {
	UnitNotFoundException,
	UnitOrderException,
} from '@/domain/units/exceptions';
import { UniqueConstraintException } from '@pathly-backend/core/index.js';

export class UpdateUnitUseCase {
	constructor(private readonly unitsRepository: IUnitsRepository) {}

	async execute(command: UpdateUnitCommand): Promise<Unit> {
		try {
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
		} catch (err) {
			if (err instanceof UniqueConstraintException) {
				const uniqueOrderViolation =
					err.fields.includes('order') && err.fields.includes('sectionId');
				if (uniqueOrderViolation) {
					throw new UnitOrderException();
				}
			}
			throw err;
		}
	}
}
