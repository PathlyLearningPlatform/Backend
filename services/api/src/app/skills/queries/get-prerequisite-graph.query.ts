import { IQueryHandler } from '@/app/common';
import { SkillDto, SkillRelationshipDto } from '../dtos';
import { UUID } from '@/domain/common';
import { SkillGraphService, SkillId } from '@/domain/skills';

export type GetPrerequisiteGraphCommand = {
	parentSkillId?: string;
};

export type GetPrerequisiteGraphResult = {
	nodes: SkillDto[];
	edges: SkillRelationshipDto[];
};

export class GetPrerequisiteGraphHandler
	implements
		IQueryHandler<GetPrerequisiteGraphCommand, GetPrerequisiteGraphResult>
{
	constructor(private readonly skillGraphService: SkillGraphService) {}

	async execute(
		command: GetPrerequisiteGraphCommand,
	): Promise<GetPrerequisiteGraphResult> {
		const parentSkillId = command.parentSkillId
			? SkillId.create(UUID.create(command.parentSkillId))
			: null;

		const result =
			await this.skillGraphService.getPrerequisiteGraph(parentSkillId);

		return {
			nodes: result.nodes.map((node) => ({
				id: node.id.toString(),
				name: node.name.toString(),
				slug: node.slug.toString(),
			})),
			edges: result.edges.map((edge) => ({
				type: edge.type,
				fromId: edge.fromId.toString(),
				toId: edge.toId.toString(),
			})),
		};
	}
}
