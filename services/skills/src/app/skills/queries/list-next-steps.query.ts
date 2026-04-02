import { IQueryHandler } from '@/app/common';
import { SkillDto } from '../dtos';
import { SkillGraphService } from '@/domain/services';
import { SkillId } from '@/domain/skills';
import { UUID } from '@/domain/common';

export type ListSkillNextStepsQuery = {
	skillId: string;
};
export type ListSkillNextStepsResult = SkillDto[];

export class ListSkillNextStepsHandler
	implements IQueryHandler<ListSkillNextStepsQuery, ListSkillNextStepsResult>
{
	constructor(private readonly skillGraphService: SkillGraphService) {}

	async execute(
		command: ListSkillNextStepsQuery,
	): Promise<ListSkillNextStepsResult> {
		const skills = await this.skillGraphService.listNextSteps(
			SkillId.create(UUID.create(command.skillId)),
		);

		return skills.map((skill) => ({
			id: skill.id.toString(),
			name: skill.name.toString(),
			slug: skill.slug.toString(),
		}));
	}
}
