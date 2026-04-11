import { IQueryHandler } from '@/app/common';
import { SkillDto } from '../dtos';
import { SkillGraphService } from '@/domain/services';
import { SkillId } from '@/domain/skills';
import { UUID } from '@/domain/common';

export type ListSkillPrerequisitiesQuery = {
	skillId: string;
};
export type ListSkillPrerequisitiesResult = SkillDto[];

export class ListSkillPrerequisitiesHandler
	implements
		IQueryHandler<ListSkillPrerequisitiesQuery, ListSkillPrerequisitiesResult>
{
	constructor(private readonly skillGraphService: SkillGraphService) {}

	async execute(
		command: ListSkillPrerequisitiesQuery,
	): Promise<ListSkillPrerequisitiesResult> {
		const skills = await this.skillGraphService.listPrerequisities(
			SkillId.create(UUID.create(command.skillId)),
		);

		return skills.map((skill) => ({
			id: skill.id.toString(),
			name: skill.name.toString(),
			slug: skill.slug.toString(),
		}));
	}
}
