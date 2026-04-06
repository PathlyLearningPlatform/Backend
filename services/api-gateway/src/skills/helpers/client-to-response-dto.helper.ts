import type {
	Skill as ClientSkill,
	SkillGraphView as ClientSkillGraphView,
} from '@pathly-backend/contracts/skills/v1/skills.js'
import { SkillRelationshipType } from '@pathly-backend/contracts/skills/v1/skills.js'
import type { SkillGraphResponseDto, SkillResponseDto } from '../dtos'

const numericRelationshipTypeToString: Record<number, SkillRelationshipType> = {
	0: SkillRelationshipType.UNSPECIFIED,
	1: SkillRelationshipType.PART_OF,
	2: SkillRelationshipType.NEXT_STEP_OF,
}

function normalizeRelationshipType(value: unknown): SkillRelationshipType {
	if (typeof value === 'number') {
		return (
			numericRelationshipTypeToString[value] ??
			SkillRelationshipType.UNSPECIFIED
		)
	}

	if (typeof value === 'string') {
		if (
			Object.values(SkillRelationshipType).includes(
				value as SkillRelationshipType,
			)
		) {
			return value as SkillRelationshipType
		}

		const enumValue =
			SkillRelationshipType[value as keyof typeof SkillRelationshipType]

		if (enumValue) {
			return enumValue
		}
	}

	return SkillRelationshipType.UNSPECIFIED
}

export function clientSkillToResponseDto(
	client: ClientSkill,
): SkillResponseDto {
	return {
		id: client.id,
		name: client.name,
		slug: client.slug,
	}
}

export function clientSkillGraphToResponseDto(
	client: ClientSkillGraphView,
): SkillGraphResponseDto {
	return {
		nodes: Array.from(client.nodes).map(clientSkillToResponseDto),
		edges: Array.from(client.edges).map((edge) => ({
			fromId: edge.fromId,
			toId: edge.toId,
			type: normalizeRelationshipType(edge.type),
		})),
	}
}
