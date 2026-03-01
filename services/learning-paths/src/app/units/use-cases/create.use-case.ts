import { randomUUID } from 'crypto';
import type { ISectionsRepository } from '@/domain/sections/interfaces';
import type { CreateUnitCommand } from '@/app/units/commands';
import type { IUnitsRepository } from '@domain/units/interfaces';
import { SectionNotFoundException } from '@/domain/sections/exceptions';
import { Unit } from '@/domain/units/entities';
import { UniqueConstraintException } from '@pathly-backend/core/index.js';
import { UnitOrderException } from '@/domain/units/exceptions';

export class CreateUnitUseCase {
	constructor(
		private readonly unitsRepository: IUnitsRepository,
		private readonly sectionsRepository: ISectionsRepository,
	) {}

	async execute(command: CreateUnitCommand): Promise<Unit> {
		try {
			const section = await this.sectionsRepository.findOne(command.sectionId);
			if (!section) {
				throw new SectionNotFoundException(command.sectionId);
			}

			const unit = new Unit({
				id: randomUUID(),
				sectionId: section.id,
				createdAt: new Date(),
				description: command.description ?? null,
				name: command.name,
				order: command.order,
			});

			await this.unitsRepository.save(unit);

			section.update({
				unitCount: section.unitCount + 1,
			});

			await this.sectionsRepository.save(section);

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
