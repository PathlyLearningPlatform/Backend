import { ICommandHandler } from '@/app/common';
import { SkillDto } from '../dtos';
import {
	SkillId,
	SkillName,
	SkillNotFoundException,
	SkillGraphService,
} from '@/domain/skills';
import { UUID, ValidationException } from '@/domain/common';

export type UpdateSkillCommand = {
	where: {
		id: string;
	};
	fields: Partial<{
		name: string;
	}>;
};

export class UpdateSkillHandler
	implements ICommandHandler<UpdateSkillCommand, SkillDto>
{
	constructor(private readonly skillGraphService: SkillGraphService) {}

	/**
	 * @throws {SkillNotFoundException}
	 * @throws {ValidationException}
	 */
	async execute(command: UpdateSkillCommand): Promise<SkillDto> {
		const id = SkillId.create(UUID.create(command.where.id));
		const skill = await this.skillGraphService.findById(id);

		if (!skill) {
			throw new SkillNotFoundException(id.toString());
		}

		skill.update({
			name: command.fields.name
				? SkillName.create(command.fields.name)
				: undefined,
		});

		this.skillGraphService.save(skill.id, skill.name);

		return {
			id: skill.id.toString(),
			name: skill.name.toString(),
			slug: skill.slug.toString(),
		};
	}
}
