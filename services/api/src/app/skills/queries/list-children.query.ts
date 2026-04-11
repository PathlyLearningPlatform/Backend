import { IQueryHandler } from '@/app/common';
import { SkillDto } from '../dtos';
import { SkillGraphService } from '@/domain/services';
import { SkillId } from '@/domain/skills';
import { UUID } from '@/domain/common';

export type ListSkillChildrenQuery = {
	skillId: string;
};
export type ListSkillChildrenResult = SkillDto[];

export class ListSkillChildrenHandler
	implements IQueryHandler<ListSkillChildrenQuery, ListSkillChildrenResult>
{
	constructor(private readonly skillGraphService: SkillGraphService) {}

	async execute(
		command: ListSkillChildrenQuery,
	): Promise<ListSkillChildrenResult> {
		const skills = await this.skillGraphService.listChildren(
			SkillId.create(UUID.create(command.skillId)),
		);

		return skills.map((skill) => ({
			id: skill.id.toString(),
			name: skill.name.toString(),
			slug: skill.slug.toString(),
		}));
	}
}
