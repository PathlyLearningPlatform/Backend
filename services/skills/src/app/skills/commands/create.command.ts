import { ICommandHandler } from '@/app/common';
import { SkillDto } from '../dtos';
import { SkillId, SkillName } from '@/domain/skills';
import { UUID, ValidationException } from '@/domain/common';
import { randomUUID } from 'node:crypto';
import { SkillGraphService } from '@/domain/services';
import { SkillNotFoundException } from '@/domain/exceptions';

export type CreateSkillCommand = {
	name: string;
	parentId?: string;
};

export class CreateSkillHandler
	implements ICommandHandler<CreateSkillCommand, SkillDto>
{
	constructor(private readonly skillGraphService: SkillGraphService) {}

	/**
	 * @throws {SkillNotFoundException}
	 * @throws {ValidationException}
	 */
	async execute(command: CreateSkillCommand): Promise<SkillDto> {
		const id = SkillId.create(UUID.create(randomUUID()));

		const skill = await this.skillGraphService.save(
			id,
			SkillName.create(command.name),
			command.parentId
				? SkillId.create(UUID.create(command.parentId))
				: undefined,
		);

		return {
			id: skill.id.toString(),
			name: skill.name.toString(),
			slug: skill.slug.toString(),
		};
	}
}
