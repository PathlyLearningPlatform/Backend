import { type ICommandHandler, SectionNotFoundException } from "@/app/common";
import type { ISectionRepository } from "@/domain/sections/repositories";
import {
	SectionDescription,
	SectionName,
} from "@/domain/sections/value-objects";
import { SectionId } from "@/domain/sections/value-objects/id.vo";
import type { SectionDto } from "../dtos";

type UpdateSectionCommand = {
	where: {
		id: string;
	};
	props?: {
		name?: string;
		description?: string | null;
	};
};
type UpdateSectionResult = SectionDto;

export class UpdateSectionHandler
	implements ICommandHandler<UpdateSectionCommand, UpdateSectionResult>
{
	constructor(private readonly sectionRepository: ISectionRepository) {}

	async execute(command: UpdateSectionCommand): Promise<UpdateSectionResult> {
		const id = SectionId.create(command.where.id);
		const section = await this.sectionRepository.load(id);

		if (!section) {
			throw new SectionNotFoundException(id.value);
		}

		const name = command.props?.name
			? SectionName.create(command.props.name)
			: undefined;

		const description = command.props?.description
			? SectionDescription.create(command.props.description)
			: command.props?.description === null
				? null
				: undefined;

		section.update(new Date(), { name, description });

		await this.sectionRepository.save(section);

		return {
			id: section.id.value,
			learningPathId: section.learningPathId.toString(),
			name: section.name.value,
			description: section.description?.value ?? null,
			createdAt: section.createdAt,
			updatedAt: section.updatedAt ?? null,
			order: section.order.value,
			unitCount: section.unitCount,
		};
	}
}
