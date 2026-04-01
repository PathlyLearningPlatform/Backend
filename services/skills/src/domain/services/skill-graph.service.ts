import { Slug } from '../common';
import { SkillNotFoundException } from '../exceptions';
import { ISkillGraph } from '../interfaces';
import {
	RootSkillParentException,
	Skill,
	SkillCannotReferenceItselfException,
	SkillId,
	SkillName,
	SkillRelationship,
	SkillRelationshipType,
} from '../skills';

export class SkillGraphService {
	constructor(private readonly skillGraph: ISkillGraph) {}

	/**
	 * @description creates root skill with the given id.
	 * If root skill already exists id is ignored and it is updated with provided properties.
	 */
	async saveRootSkill(id: SkillId, name: SkillName): Promise<Skill> {
		let rootSkill = await this.skillGraph.findRootSkill();

		if (!rootSkill) {
			rootSkill = Skill.create(id, {
				name,
				isRoot: true,
				parentId: null,
			});
		}

		rootSkill.update({
			name,
		});

		await this.skillGraph.saveSkill(rootSkill);

		return rootSkill;
	}

	/**
	 * @description creates skill with given id and props.
	 * If skill already exists it is updated.
	 * @throws {SkillNotFoundException} if parent skill is not found
	 */
	async saveSkill(
		id: SkillId,
		name: SkillName,
		parentId?: SkillId,
	): Promise<Skill> {
		if (parentId) {
			const parentSkill = await this.skillGraph.findSkillById(parentId);

			if (!parentSkill) {
				throw new SkillNotFoundException(parentId.toString());
			}
		}

		const skill = Skill.create(id, { name, isRoot: false, parentId });

		await this.skillGraph.saveSkill(skill);

		return skill;
	}

	/**
	 * @description removes skill with all it's relationships
	 * @throws {SkillNotFoundException}
	 */
	async removeSkill(id: SkillId) {
		const wasRemoved = await this.skillGraph.removeSkill(id);

		if (!wasRemoved) {
			throw new SkillNotFoundException(id.toString());
		}
	}

	/**
	 * @description adds prerequisite skill to a target skill.
	 * @throws {SkillNotFoundException} if either of the skills does not exist.
	 * @throws {SkillCannotReferenceItselfException} if both ids are the same.
	 */
	async addPrerequisite(
		prerequisiteId: SkillId,
		targetId: SkillId,
	): Promise<void> {
		const relationship = SkillRelationship.create({
			fromId: prerequisiteId,
			toId: targetId,
			type: SkillRelationshipType.PREREQUISITE_OF,
		});

		await this.assertSkillsExist(prerequisiteId, targetId);
		await this.skillGraph.link(relationship);
	}

	/**
	 * @description adds alternative skill.
	 * @throws {SkillNotFoundException} if either of the skills does not exist.
	 * @throws {SkillCannotReferenceItselfException} if both ids are the same.
	 */
	async addAlternative(firstId: SkillId, secondId: SkillId): Promise<void> {
		const relationship = SkillRelationship.create({
			fromId: firstId,
			toId: secondId,
			type: SkillRelationshipType.ALTERNATIVE_TO,
		});

		await this.assertSkillsExist(firstId, secondId);
		await this.skillGraph.link(relationship);
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

		await this.skillGraph.saveSkill(child);
	}

	/**
	 * @description adds common skill.
	 * @throws {SkillNotFoundException} if either of the skills does not exist.
	 * @throws {SkillCannotReferenceItselfException} if both ids are the same.
	 */
	async addCommon(firstId: SkillId, secondId: SkillId): Promise<void> {
		const relationship = SkillRelationship.create({
			fromId: firstId,
			toId: secondId,
			type: SkillRelationshipType.COMMON_WITH,
		});

		await this.assertSkillsExist(firstId, secondId);
		await this.skillGraph.link(relationship);
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
		const relationship = SkillRelationship.create({
			fromId,
			toId,
			type: relationshipType,
		});

		const wasRemoved = await this.skillGraph.unlink(relationship);

		if (!wasRemoved) {
			throw new SkillNotFoundException();
		}
	}

	async findSkillById(id: SkillId) {
		return this.skillGraph.findSkillById(id);
	}
	async findSkillBySlug(slug: Slug) {
		return this.skillGraph.findSkillBySlug(slug);
	}
	async listSkillPrerequisities(id: SkillId): Promise<Skill[]> {
		return this.skillGraph.listSkillPrerequisities(id);
	}
	async listSkillAlternatives(id: SkillId): Promise<Skill[]> {
		return this.skillGraph.listSkillAlternatives(id);
	}
	async listSkillChildren(id: SkillId): Promise<Skill[]> {
		return this.skillGraph.listSkillChildren(id);
	}
	async listCommonSkills(id: SkillId): Promise<Skill[]> {
		return this.skillGraph.listCommonSkills(id);
	}
	async getTopLevelPrerequisiteGraph() {
		return this.skillGraph.getTopLevelPrerequisiteGraph();
	}
	async getPrerequisiteGraph(parentId: SkillId | null) {
		return this.skillGraph.getPrerequisiteGraph(parentId);
	}

	private async assertSkillsExist(
		firstId: SkillId,
		secondId: SkillId,
	): Promise<Skill[]> {
		const [first, second] = await Promise.all([
			this.skillGraph.findSkillById(firstId),
			this.skillGraph.findSkillById(secondId),
		]);

		if (!first || !second) {
			throw new SkillNotFoundException();
		}

		return [first, second];
	}
}
