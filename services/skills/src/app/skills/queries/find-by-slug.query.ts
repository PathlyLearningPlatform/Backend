import { IQueryHandler } from '@/app/common';
import { SkillDto } from '../dtos';
import { SkillGraphService } from '@/domain/services';
import { Slug } from '@/domain/common';
import { SkillNotFoundException } from '@/domain/exceptions';

export type FindSkillBySlugQuery = {
	slug: string;
};

export class FindSkillBySlugHandler
	implements IQueryHandler<FindSkillBySlugQuery, SkillDto>
{
	constructor(private readonly skillGraphService: SkillGraphService) {}

	/**
	 * @throws {SkillNotFoundException}
	 */
	async execute(command: FindSkillBySlugQuery): Promise<SkillDto> {
		const slug = Slug.create(command.slug);
		const skill = await this.skillGraphService.findSkillBySlug(slug);

		if (!skill) {
			throw new SkillNotFoundException(slug.toString());
		}

		return {
			id: skill.id.toString(),
			name: skill.name.toString(),
			slug: skill.slug.toString(),
		};
	}
}
