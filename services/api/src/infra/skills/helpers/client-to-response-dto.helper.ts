import type {
	GetPrerequisiteGraphResult,
	SkillDto,
	SkillProgressDto,
} from '@/app/skills';
import type {
	SkillGraphResponseDto,
	SkillProgressResponseDto,
	SkillResponseDto,
} from '../dtos';

export function clientSkillToResponseDto(skill: SkillDto): SkillResponseDto {
	return {
		id: skill.id,
		name: skill.name,
		slug: skill.slug,
	};
}

export function clientSkillProgressToResponseDto(
	progress: SkillProgressDto,
): SkillProgressResponseDto {
	return {
		skillId: progress.skillId,
		userId: progress.userId,
		unlockedAt: progress.unlockedAt.toISOString(),
	};
}

export function clientSkillProgressesToResponseDto(
	progresses: SkillProgressDto[],
): SkillProgressResponseDto[] {
	return progresses.map(clientSkillProgressToResponseDto);
}

export function clientSkillGraphToResponseDto(
	graph: GetPrerequisiteGraphResult,
): SkillGraphResponseDto {
	return {
		nodes: graph.nodes.map(clientSkillToResponseDto),
		edges: graph.edges,
	};
}
