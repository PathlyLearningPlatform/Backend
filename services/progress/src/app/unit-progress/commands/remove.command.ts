import { ICommandHandler } from '@/app/common';
import { UUID } from '@/domain/common';
import {
	IUnitProgressRepository,
	UnitProgressId,
} from '@/domain/unit-progress';
import { UnitProgressNotFoundException } from '../exceptions';

type RemoveUnitProgressCommand = {
	id: string;
};

export class RemoveUnitProgressHandler
	implements ICommandHandler<RemoveUnitProgressCommand, void>
{
	constructor(
		private readonly unitProgressRepository: IUnitProgressRepository,
	) {}

	async execute(command: RemoveUnitProgressCommand): Promise<void> {
		const wasRemoved = await this.unitProgressRepository.remove(
			UnitProgressId.create(UUID.create(command.id)),
		);

		if (!wasRemoved) {
			throw new UnitProgressNotFoundException('');
		}
	}
}
