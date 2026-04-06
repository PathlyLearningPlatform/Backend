import {
	type ICommandHandler,
	SectionNotFoundException,
	UnitNotFoundException,
} from "@/app/common";
import { Order } from "@/domain/common";
import type { ISectionRepository } from "@/domain/sections/repositories";
import type { IUnitRepository } from "@/domain/units/repositories";
import { UnitId } from "@/domain/units/value-objects/id.vo";

type ReorderUnitCommand = {
	unitId: string;
	order: number;
};

export class ReorderUnitHandler
	implements ICommandHandler<ReorderUnitCommand, void>
{
	constructor(
		private readonly sectionRepository: ISectionRepository,
		private readonly unitRepository: IUnitRepository,
	) {}

	async execute(command: ReorderUnitCommand): Promise<void> {
		const unitId = UnitId.create(command.unitId);
		const unit = await this.unitRepository.load(unitId);

		if (!unit) {
			throw new UnitNotFoundException(command.unitId);
		}

		const section = await this.sectionRepository.load(unit.sectionId);

		// never going to happen
		// only for type safety
		if (!section) {
			throw new SectionNotFoundException(unit.sectionId.value);
		}

		const order = Order.create(command.order);
		const newOrder = section.reorderUnit(unitId, order);

		// never going to happen
		// only for type safety
		if (!newOrder) {
			throw new UnitNotFoundException(unit.id.value);
		}

		unit.update(new Date(), { order: newOrder });
		section.update(new Date());

		await this.unitRepository.save(unit);
		await this.sectionRepository.save(section);
	}
}
