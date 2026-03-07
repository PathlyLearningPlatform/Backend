import { ICommandHandler, SectionNotFoundException } from '@/app/common';
import { ISectionRepository } from '@/domain/sections/interfaces';
import { SectionId } from '@/domain/sections/value-objects/id.vo';
import { IUnitRepository } from '@/domain/units/interfaces';
import { Unit } from '@/domain/units/unit.aggregate';
import { UnitId } from '@/domain/units/value-objects/id.vo';
import { UnitDescription, UnitName } from '@/domain/units/value-objects';
import { randomUUID } from 'node:crypto';
import { UnitDto } from '@/app/units/dtos';

type AddUnitCommand = {
	sectionId: string;
	name: string;
	description?: string | null;
};
type AddUnitResult = UnitDto;

export class AddUnitHandler
	implements ICommandHandler<AddUnitCommand, AddUnitResult>
{
	constructor(
		private readonly sectionRepository: ISectionRepository,
		private readonly unitRepository: IUnitRepository,
	) {}

	async execute(command: AddUnitCommand): Promise<AddUnitResult> {
		const sectionId = SectionId.create(command.sectionId);
		const section = await this.sectionRepository.load(sectionId);

		if (!section) {
			throw new SectionNotFoundException(sectionId.value);
		}

		const unitId = UnitId.create(randomUUID());
		const unitRef = section.addUnit(unitId);
		const unitName = UnitName.create(command.name);
		const unitDescription =
			command.description != null
				? UnitDescription.create(command.description)
				: null;

		const unit = Unit.create(unitRef.unitId, {
			createdAt: new Date(),
			sectionId: sectionId,
			name: unitName,
			description: unitDescription,
			order: unitRef.order,
		});

		section.update(new Date());

		await this.unitRepository.save(unit);
		await this.sectionRepository.save(section);

		return {
			id: unit.id.value,
			sectionId: unit.sectionId.value,
			name: unit.name.value,
			description: unit.description?.value ?? null,
			createdAt: unit.createdAt,
			updatedAt: unit.updatedAt ?? null,
			order: unit.order.value,
			lessonCount: unit.lessonCount,
		};
	}
}
