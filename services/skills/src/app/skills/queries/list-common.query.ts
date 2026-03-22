import { IQueryHandler } from '@/app/common';
import { SkillDto } from '../dtos';
import { SkillGraphService } from '@/domain/services';
import { SkillId } from '@/domain/skills';
import { UUID } from '@/domain/common';

export type ListCommonSkillsQuery = {
	skillId: string;
};
export type ListCommonSkillsResult = SkillDto[];

export class ListCommonSkillsHandler
	implements IQueryHandler<ListCommonSkillsQuery, ListCommonSkillsResult>
{
	constructor(private readonly skillGraphService: SkillGraphService) {}

	async execute(
		command: ListCommonSkillsQuery,
	): Promise<ListCommonSkillsResult> {
		const skills = await this.skillGraphService.listCommonSkills(
			SkillId.create(UUID.create(command.skillId)),
		);

		return skills.map((skill) => ({
			id: skill.id.toString(),
			name: skill.name.toString(),
			slug: skill.slug.toString(),
		}));
	}
}
