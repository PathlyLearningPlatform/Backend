import type { ICommandHandler } from "@/app/common";
import { UserId, UUID } from "@/domain/common";
import {
	type IUnitProgressRepository,
	UnitId,
	UnitProgressId,
} from "@/domain/units";
import { UnitProgressNotFoundException } from "../exceptions";

type RemoveUnitProgressCommand = {
	unitId: string;
	userId: string;
};

export class RemoveUnitProgressHandler
	implements ICommandHandler<RemoveUnitProgressCommand, void>
{
	constructor(
		private readonly unitProgressRepository: IUnitProgressRepository,
	) {}

	async execute(command: RemoveUnitProgressCommand): Promise<void> {
		const unitId = UnitId.create(command.unitId);
		const userId = UserId.create(UUID.create(command.userId));
		const id = UnitProgressId.create(unitId, userId);

		const wasRemoved = await this.unitProgressRepository.remove(id);

		if (!wasRemoved) {
			throw new UnitProgressNotFoundException("");
		}
	}
}
