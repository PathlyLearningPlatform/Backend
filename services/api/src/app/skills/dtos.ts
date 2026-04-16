import { SkillRelationshipType } from '@/domain/skills';

export interface SkillProgressDto {
	skillId: string;
	userId: string;
	unlockedAt: Date;
}

export interface SkillRelationshipDto {
	fromId: string;
	toId: string;
	type: SkillRelationshipType;
}

export interface SkillDto {
	id: string;
	name: string;
	slug: string;
}
