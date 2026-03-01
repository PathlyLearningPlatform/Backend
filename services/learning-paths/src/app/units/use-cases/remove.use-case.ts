import { InvalidReferenceException } from '@pathly-backend/core/index.js';
import type { IUnitsRepository } from '@domain/units/interfaces';
import {
	UnitCannotBeRemovedException,
	UnitNotFoundException,
} from '@/domain/units/exceptions';
import { ISectionsRepository } from '@/domain/sections/interfaces';
import { Section } from '@/domain/sections/entities';

export class RemoveUnitUseCase {
	constructor(
		private readonly unitsRepository: IUnitsRepository,
		private readonly sectionsRepository: ISectionsRepository,
	) {}

	async execute(id: string): Promise<void> {
		try {
			const unit = await this.unitsRepository.remove(id);

			if (!unit) {
				throw new UnitNotFoundException(id);
			}

			// section will never be null, because unit cannot be created with sectionId that doesnt exist
			const section = (await this.sectionsRepository.findOne(
				unit.sectionId,
			)) as Section;

			section.update({
				unitCount: section.unitCount - 1,
			});

			await this.sectionsRepository.save(section);
		} catch (err) {
			if (err instanceof InvalidReferenceException) {
				throw new UnitCannotBeRemovedException(id);
			}

			throw err;
		}
	}
}
