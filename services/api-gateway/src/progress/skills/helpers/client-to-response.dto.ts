import type { SkillProgress as ClientSkillProgress } from '@pathly-backend/contracts/skills/v1/skill_progress.js'
import type { SkillProgressResponseDto } from '../dtos'

export function clientSkillProgressToResponseDto(
	client: ClientSkillProgress,
): SkillProgressResponseDto {
	return {
		skillId: client.skillId,
		userId: client.userId,
		unlockedAt: client.unlockedAt,
	}
}
