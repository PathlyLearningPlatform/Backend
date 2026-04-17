import { IQueryHandler } from '@/app/common';
import { SkillDto } from '../dtos';
import {
	SkillId,
	SkillNotFoundException,
	SkillGraphService,
} from '@/domain/skills';
import { UUID } from '@/domain/common';

export type FindSkillByIdQuery = {
	id: string;
};

export class FindSkillByIdHandler
	implements IQueryHandler<FindSkillByIdQuery, SkillDto>
{
	constructor(private readonly skillGraphService: SkillGraphService) {}

	/**
	 * @throws {SkillNotFoundException}
	 */
	async execute(command: FindSkillByIdQuery): Promise<SkillDto> {
		const id = SkillId.create(UUID.create(command.id));
		const skill = await this.skillGraphService.findById(id);

		if (!skill) {
			throw new SkillNotFoundException(command.id);
		}

		return {
			id: skill.id.toString(),
			name: skill.name.toString(),
			slug: skill.slug.toString(),
		};
	}
}
