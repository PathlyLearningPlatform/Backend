import { SkillRelationshipType } from '@/domain/skills';

export interface SkillRelationshipDto {
	fromId: string;
	toId: string;
	type: SkillRelationshipType;
	isDirectional: boolean;
}
