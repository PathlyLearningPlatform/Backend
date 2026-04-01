import { SkillRelationshipType } from '@/domain/skills';
import { SkillRelationshipType as ClientSkillRelationshipType } from '@pathly-backend/contracts/skills/v1/skills.js';

export function skillRelationshipTypeToClient(
	domain: SkillRelationshipType,
): ClientSkillRelationshipType {
	switch (domain) {
		case SkillRelationshipType.PREREQUISITE_OF:
			return ClientSkillRelationshipType.PREREQUISITE_OF;
		case SkillRelationshipType.PART_OF:
			return ClientSkillRelationshipType.PART_OF;
		case SkillRelationshipType.ALTERNATIVE_TO:
			return ClientSkillRelationshipType.ALTERNATIVE_TO;
		case SkillRelationshipType.COMMON_WITH:
			return ClientSkillRelationshipType.COMMON_WITH;
	}
}
