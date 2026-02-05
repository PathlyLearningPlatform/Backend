import { randomUUID } from 'crypto';
import type { ISectionsRepository } from '@/app/sections/interfaces';
import type { CreateUnitCommand } from '@/app/units/commands';
import type { IUnitsRepository } from '@/app/units/interfaces';
import { SectionNotFoundException } from '@/domain/sections/exceptions';
import { Unit } from '@/domain/units/entities';

export class CreateUnitUseCase {
	constructor(
		private readonly unitsRepository: IUnitsRepository,
		private readonly sectionsRepository: ISectionsRepository,
	) {}

	async execute(command: CreateUnitCommand): Promise<Unit> {
		const section = await this.sectionsRepository.findOne(command.sectionId);

		if (!section) {
			throw new SectionNotFoundException(command.sectionId);
		}

		const unit = new Unit({
			id: randomUUID(),
			sectionId: section.id,
			createdAt: new Date(),
			updatedAt: new Date(),
			description: command.description ?? null,
			name: command.name,
			order: command.order,
		});

		this.unitsRepository.save(unit);

		return unit;
	}
}
