import { SkillRelationshipType } from '@/domain/skills';
import { SkillRelationshipType as ClientSkillRelationshipType } from '@pathly-backend/contracts/skills/v1/skills.js';

export function skillRelationshipTypeToClient(
	domain: SkillRelationshipType,
): ClientSkillRelationshipType {
	switch (domain) {
		case SkillRelationshipType.NEXT_STEP_OF:
			return ClientSkillRelationshipType.NEXT_STEP_OF;
		case SkillRelationshipType.PART_OF:
			return ClientSkillRelationshipType.PART_OF;
	}
}
