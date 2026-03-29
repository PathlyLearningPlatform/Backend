import { IQueryHandler } from '@/app/common';
import { SkillGraphService } from '@/domain/services';
import { SkillDto, SkillRelationshipDto } from '../dtos';

export type GetTopLevelPrerequisiteGraphResult = {
	nodes: SkillDto[];
	edges: SkillRelationshipDto[];
};

export class GetTopLevelPrerequisiteGraphHandler
	implements IQueryHandler<undefined, GetTopLevelPrerequisiteGraphResult>
{
	constructor(private readonly skillGraphService: SkillGraphService) {}

	async execute(): Promise<GetTopLevelPrerequisiteGraphResult> {
		const result = await this.skillGraphService.getTopLevelPrerequisiteGraph();

		return {
			nodes: result.nodes.map((node) => ({
				id: node.id.toString(),
				name: node.name.toString(),
				slug: node.slug.toString(),
			})),
			edges: result.edges.map((edge) => ({
				type: edge.type,
				isDirectional: edge.isDirectional,
				fromId: edge.fromId.toString(),
				toId: edge.toId.toString(),
			})),
		};
	}
}
