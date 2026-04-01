import { IQueryHandler } from '@/app/common';
import { SkillGraphService } from '@/domain/services';
import { SkillDto, SkillRelationshipDto } from '../dtos';
import { SkillId } from '@/domain/skills';
import { UUID } from '@/domain/common';

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
				isDirectional: edge.isDirectional,
				fromId: edge.fromId.toString(),
				toId: edge.toId.toString(),
			})),
		};
	}
}
