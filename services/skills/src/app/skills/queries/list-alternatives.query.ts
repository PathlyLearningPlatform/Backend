import { IQueryHandler } from '@/app/common';
import { SkillDto } from '../dtos';
import { SkillGraphService } from '@/domain/services';
import { SkillId } from '@/domain/skills';
import { UUID } from '@/domain/common';

export type ListSkillAlternativesQuery = {
	skillId: string;
};
export type ListSkillAlternativesResult = SkillDto[];

export class ListSkillAlternativesHandler
	implements
		IQueryHandler<ListSkillAlternativesQuery, ListSkillAlternativesResult>
{
	constructor(private readonly skillGraphService: SkillGraphService) {}

	async execute(
		command: ListSkillAlternativesQuery,
	): Promise<ListSkillAlternativesResult> {
		const skills = await this.skillGraphService.listSkillAlternatives(
			SkillId.create(UUID.create(command.skillId)),
		);

		return skills.map((skill) => ({
			id: skill.id.toString(),
			name: skill.name.toString(),
			slug: skill.slug.toString(),
		}));
	}
}
