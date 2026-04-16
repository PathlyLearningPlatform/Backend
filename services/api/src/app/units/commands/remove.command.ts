import {
	type ICommandHandler,
	SectionNotFoundException,
	UnitNotFoundException,
} from '@/app/common';
import type { ISectionRepository } from '@/domain/sections/repositories';
import type { IUnitRepository } from '@/domain/units/repositories';
import { UnitId } from '@/domain/units/value-objects/id.vo';

type RemoveUnitCommand = {
	unitId: string;
};

export class RemoveUnitHandler
	implements ICommandHandler<RemoveUnitCommand, void>
{
	constructor(
		private readonly sectionRepository: ISectionRepository,
		private readonly unitRepository: IUnitRepository,
	) {}

	async execute(command: RemoveUnitCommand): Promise<void> {
		const unitId = UnitId.create(command.unitId);
		const unit = await this.unitRepository.findById(unitId);

		if (!unit) {
			throw new UnitNotFoundException(unitId.value);
		}

		const section = await this.sectionRepository.findById(unit.sectionId);

		// never going to happen
		// only for type safety
		if (!section) {
			throw new SectionNotFoundException(unit.sectionId.value);
		}

		unit.ensureCanRemove();
		section.removeUnit(unitId);

		await this.unitRepository.remove(unitId);
		await this.sectionRepository.save(section);
	}
}
