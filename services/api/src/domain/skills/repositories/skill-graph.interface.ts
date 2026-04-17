import { Skill, SkillId, SkillRelationship, SkillRelationshipType } from '..';
import { Slug } from '../../common';

export interface ISkillGraph {
	/**
	 * @description creates skill from aggregate.
	 * If skill with provided id already exists it is updated.
	 */
	save(aggreagate: Skill): Promise<void>;
	/**
	 * @description removes skill with all of it's relationships
	 */
	remove(id: SkillId): Promise<boolean>;

	/**
	 * @description creates relationship between 2 skills.
	 * If neither of the skills exists, nothing happens.
	 */
	link(relationship: SkillRelationship): Promise<void>;
	/**
	 * @description removes exactly one relationship.
	 * If neither of the skills exists, nothing happens.
	 */
	unlink(relationship: SkillRelationship): Promise<void>;

	findById(id: SkillId): Promise<Skill | null>;
	findBySlug(slug: Slug): Promise<Skill | null>;

	getPrerequisiteGraph(parentId: SkillId | null): Promise<{
		nodes: Skill[];
		edges: SkillRelationship[];
	}>;

	listIncoming(
		id: SkillId,
		relationshipType: SkillRelationshipType,
	): Promise<Skill[]>;
	listOutgoing(
		id: SkillId,
		relationshipType: SkillRelationshipType,
	): Promise<Skill[]>;
}
