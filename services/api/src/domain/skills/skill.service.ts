import { Slug } from '../common';
import { SkillNotFoundException } from './exceptions';
import { ISkillGraph } from './repositories';
import {
	Skill,
	SkillCannotReferenceItselfException,
	SkillId,
	SkillName,
	SkillRelationship,
	SkillRelationshipType,
} from '.';

export class SkillGraphService {
	constructor(private readonly skillGraph: ISkillGraph) {}
	/**
	 * @description creates skill with given id and props.
	 * If skill already exists it is updated.
	 * @throws {SkillNotFoundException} if parent skill is not found
	 */
	async save(id: SkillId, name: SkillName, parentId?: SkillId): Promise<Skill> {
		if (parentId) {
			const parentSkill = await this.skillGraph.findById(parentId);

			if (!parentSkill) {
				throw new SkillNotFoundException(parentId.toString());
			}
		}

		const skill = Skill.create(id, { name, isRoot: false, parentId });

		await this.skillGraph.save(skill);

		return skill;
	}
	/**
	 * @description removes skill with all it's relationships
	 * @throws {SkillNotFoundException}
	 */
	async remove(id: SkillId) {
		const wasRemoved = await this.skillGraph.remove(id);

		if (!wasRemoved) {
			throw new SkillNotFoundException(id.toString());
		}
	}

	/**
	 * @description removes exactly one relationship.
	 * @throws {SkillNotFoundException} if either of the skills does not exist.
	 * @throws {SkillCannotReferenceItselfException} if both ids are the same.
	 */
	async unlink(
		fromId: SkillId,
		toId: SkillId,
		relationshipType: SkillRelationshipType,
	) {
		await this.assertSkillsExist(fromId, toId);

		const relationship = SkillRelationship.create({
			fromId,
			toId,
			type: relationshipType,
		});

		await this.skillGraph.unlink(relationship);
	}

	async findById(id: SkillId): Promise<Skill | null> {
		return this.skillGraph.findById(id);
	}
	async findBySlug(slug: Slug): Promise<Skill | null> {
		return this.skillGraph.findBySlug(slug);
	}

	/**
	 * @description adds prerequisite skill to a target skill.
	 * @throws {SkillNotFoundException} if either of the skills does not exist.
	 * @throws {SkillCannotReferenceItselfException} if both ids are the same.
	 */
	async addNextStep(prerequisiteId: SkillId, targetId: SkillId): Promise<void> {
		const relationship = SkillRelationship.create({
			fromId: targetId,
			toId: prerequisiteId,
			type: SkillRelationshipType.NEXT_STEP_OF,
		});

		await this.assertSkillsExist(prerequisiteId, targetId);
		await this.skillGraph.link(relationship);
	}
	async listNextSteps(id: SkillId): Promise<Skill[]> {
		return this.skillGraph.listIncoming(id, SkillRelationshipType.NEXT_STEP_OF);
	}
	async listPrerequisities(id: SkillId): Promise<Skill[]> {
		return this.skillGraph.listOutgoing(id, SkillRelationshipType.NEXT_STEP_OF);
	}

	/**
	 * @description adds child skill to a parent skill.
	 * @throws {SkillNotFoundException} if either of the skills does not exist.
	 * @throws {SkillCannotReferenceItselfException} if both ids are the same.
	 */
	async addChild(parentId: SkillId, childId: SkillId): Promise<void> {
		const relationship = SkillRelationship.create({
			fromId: childId,
			toId: parentId,
			type: SkillRelationshipType.PART_OF,
		});

		const [child] = await this.assertSkillsExist(childId, parentId);
		await this.skillGraph.link(relationship);

		child.update({
			parentId: parentId,
		});

		await this.skillGraph.save(child);
	}
	async listChildren(id: SkillId): Promise<Skill[]> {
		return this.skillGraph.listIncoming(id, SkillRelationshipType.PART_OF);
	}
	async findParent(id: SkillId): Promise<Skill | null> {
		const skill = await this.skillGraph.findById(id);

		if (!skill) {
			return null;
		}

		if (!skill.parentId) {
			return null;
		}

		return this.skillGraph.findById(skill.parentId);
	}

	async getPrerequisiteGraph(parentId: SkillId | null) {
		return this.skillGraph.getPrerequisiteGraph(parentId);
	}

	private async assertSkillsExist(
		firstId: SkillId,
		secondId: SkillId,
	): Promise<Skill[]> {
		const [first, second] = await Promise.all([
			this.skillGraph.findById(firstId),
			this.skillGraph.findById(secondId),
		]);

		if (!first || !second) {
			throw new SkillNotFoundException();
		}

		return [first, second];
	}
}
