import type { ICommandHandler } from "@/app/common";
import { UserId, UUID } from "@/domain/common";
import {
	type ISectionProgressRepository,
	SectionId,
	SectionProgressId,
} from "@/domain/sections";
import { SectionProgressNotFoundException } from "../exceptions";

type RemoveSectionProgressCommand = {
	sectionId: string;
	userId: string;
};

export class RemoveSectionProgressHandler
	implements ICommandHandler<RemoveSectionProgressCommand, void>
{
	constructor(
		private readonly sectionProgressRepository: ISectionProgressRepository,
	) {}

	async execute(command: RemoveSectionProgressCommand): Promise<void> {
		const sectionId = SectionId.create(command.sectionId);
		const userId = UserId.create(UUID.create(command.userId));
		const id = SectionProgressId.create(sectionId, userId);

		const wasRemoved = await this.sectionProgressRepository.remove(id);

		if (!wasRemoved) {
			throw new SectionProgressNotFoundException("");
		}
	}
}
