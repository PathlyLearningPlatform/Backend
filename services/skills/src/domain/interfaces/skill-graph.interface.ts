import {
	Skill,
	SkillId,
	SkillRelationship,
	SkillRelationshipType,
} from '../skills';
import { SkillNotFoundException } from '../exceptions';
import { Slug } from '../common';

export interface ISkillGraph {
	/**
	 * @description creates skill from aggregate.
	 * If skill with provided id already exists it is updated.
	 */
	saveSkill(aggreagate: Skill): Promise<void>;

	/**
	 * @description removes skill with all of it's relationships
	 */
	removeSkill(id: SkillId): Promise<boolean>;

	/**
	 * @description creates relationship between 2 skills.
	 * If neither of the skills exists, nothing happens.
	 */
	link(relationship: SkillRelationship): Promise<void>;

	/**
	 * @description removes exactly one relationship.
	 * If neither of the skills exists, nothing happens.
	 * @returns false if relationship was not removed due to non-existence of one of the skills
	 */
	unlink(relationship: SkillRelationship): Promise<boolean>;

	findSkillById(id: SkillId): Promise<Skill | null>;
	findSkillBySlug(slug: Slug): Promise<Skill | null>;
	findRootSkill(): Promise<Skill | null>;

	getTopLevelPrerequisiteGraph(): Promise<{
		nodes: Skill[];
		edges: SkillRelationship[];
	}>;
	listSkillPrerequisities(id: SkillId): Promise<Skill[]>;
	listSkillAlternatives(id: SkillId): Promise<Skill[]>;
	listSkillChildren(id: SkillId): Promise<Skill[]>;
	listCommonSkills(id: SkillId): Promise<Skill[]>;
}
