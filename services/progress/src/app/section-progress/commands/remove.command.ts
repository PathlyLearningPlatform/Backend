import { ICommandHandler } from '@/app/common';
import { UUID } from '@/domain/common';
import {
	ISectionProgressRepository,
	SectionProgressId,
} from '@/domain/section-progress';
import { SectionProgressNotFoundException } from '../exceptions';

export type RemoveSectionProgressCommand = {
	id: string;
};

export class RemoveSectionProgressHandler
	implements ICommandHandler<RemoveSectionProgressCommand, void>
{
	constructor(
		private readonly sectionProgressRepository: ISectionProgressRepository,
	) {}

	async execute(command: RemoveSectionProgressCommand): Promise<void> {
		const wasRemoved = await this.sectionProgressRepository.remove(
			SectionProgressId.create(UUID.create(command.id)),
		);

		if (!wasRemoved) {
			throw new SectionProgressNotFoundException(command.id);
		}
	}
}
