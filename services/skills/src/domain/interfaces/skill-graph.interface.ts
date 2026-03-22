import {
	Skill,
	SkillId,
	SkillRelationship,
	SkillRelationshipType,
} from '../skills';
import { SkillNotFoundException } from '../exceptions';
import { Slug } from '../common';

export interface ISkillGraph {
	saveSkill(aggreagate: Skill): Promise<void>;

	/**
	 * @description removes skill with all of it's relationships
	 */
	removeSkill(id: SkillId): Promise<boolean>;

	/**
	 * @throws {SkillNotFoundException} when either skill is not found
	 */
	unlink(relationship: SkillRelationship): Promise<void>;

	/**
	 * @throws {SkillNotFoundException} when either skill is not found
	 */
	link(relationship: SkillRelationship): Promise<void>;

	findSkillById(id: SkillId): Promise<Skill | null>;
	findSkillBySlug(slug: Slug): Promise<Skill | null>;
	findRootSkill(): Promise<Skill | null>;
	relationshipExists(relationship: SkillRelationship): Promise<boolean>;

	listSkillPrerequisities(id: SkillId): Promise<Skill[]>;
	listSkillAlternatives(id: SkillId): Promise<Skill[]>;
	listSkillChildren(id: SkillId): Promise<Skill[]>;
	listCommonSkills(id: SkillId): Promise<Skill[]>;
}
