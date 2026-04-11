import { type ICommandHandler, UnitNotFoundException } from "@/app/common";
import type { IUnitRepository } from "@/domain/units/repositories";
import { UnitDescription, UnitName } from "@/domain/units/value-objects";
import { UnitId } from "@/domain/units/value-objects/id.vo";
import type { UnitDto } from "../dtos";

type UpdateUnitCommand = {
	where: {
		id: string;
	};
	props?: {
		name?: string;
		description?: string | null;
	};
};
type UpdateUnitResult = UnitDto;

export class UpdateUnitHandler
	implements ICommandHandler<UpdateUnitCommand, UpdateUnitResult>
{
	constructor(private readonly unitRepository: IUnitRepository) {}

	async execute(command: UpdateUnitCommand): Promise<UpdateUnitResult> {
		const id = UnitId.create(command.where.id);
		const unit = await this.unitRepository.load(id);

		if (!unit) {
			throw new UnitNotFoundException(id.value);
		}

		const name = command.props?.name
			? UnitName.create(command.props.name)
			: undefined;

		const description = command.props?.description
			? UnitDescription.create(command.props.description)
			: command.props?.description === null
				? null
				: undefined;

		unit.update(new Date(), { name, description });

		await this.unitRepository.save(unit);

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
