import { Slug } from '../common';
import { SkillNotFoundException } from '../exceptions';
import { ISkillGraph } from '../interfaces';
import {
	RootSkillParentException,
	Skill,
	SkillId,
	SkillName,
	SkillRelationship,
	SkillRelationshipType,
} from '../skills';

export class SkillGraphService {
	constructor(private readonly skillGraph: ISkillGraph) {}

	/**
	 * @throws {RootSkillParentException}
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

		await this.skillGraph.saveSkill(rootSkill);

		return rootSkill;
	}

	/**
	 * @throws {SkillNotFoundException}
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

	async addPrerequisite(
		prerequisiteId: SkillId,
		targetId: SkillId,
	): Promise<void> {
		const relationship = SkillRelationship.create({
			fromId: prerequisiteId,
			toId: targetId,
			type: SkillRelationshipType.PREREQUISITE_OF,
		});

		const exists = await this.skillGraph.relationshipExists(relationship);

		if (exists) {
			return;
		}

		await this.skillGraph.link(relationship);
	}

	async addAlternative(firstId: SkillId, secondId: SkillId): Promise<void> {
		const relationship = SkillRelationship.create({
			fromId: firstId,
			toId: secondId,
			type: SkillRelationshipType.ALTERNATIVE_TO,
		});

		const exists = await this.skillGraph.relationshipExists(relationship);

		if (exists) {
			return;
		}

		await this.skillGraph.link(relationship);
	}

	async addChild(parentId: SkillId, childId: SkillId): Promise<void> {
		const relationship = SkillRelationship.create({
			fromId: childId,
			toId: parentId,
			type: SkillRelationshipType.PART_OF,
		});

		const exists = await this.skillGraph.relationshipExists(relationship);

		if (exists) {
			return;
		}

		await this.skillGraph.link(relationship);
	}

	async addCommon(firstId: SkillId, secondId: SkillId): Promise<void> {
		const relationship = SkillRelationship.create({
			fromId: firstId,
			toId: secondId,
			type: SkillRelationshipType.COMMON_WITH,
		});

		const exists = await this.skillGraph.relationshipExists(relationship);

		if (exists) {
			return;
		}

		await this.skillGraph.link(relationship);
	}

	/**
	 * @throws {SkillNotFoundException}
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

		await this.skillGraph.unlink(relationship);
	}

	async findSkillById(id: SkillId) {
		return this.skillGraph.findSkillById(id);
	}

	async findSkillBySlug(slug: Slug) {
		return this.skillGraph.findSkillBySlug(slug);
	}

	listSkillPrerequisities(id: SkillId): Promise<Skill[]> {
		return this.skillGraph.listSkillPrerequisities(id);
	}

	listSkillAlternatives(id: SkillId): Promise<Skill[]> {
		return this.skillGraph.listSkillAlternatives(id);
	}

	listSkillChildren(id: SkillId): Promise<Skill[]> {
		return this.skillGraph.listSkillChildren(id);
	}

	listCommonSkills(id: SkillId): Promise<Skill[]> {
		return this.skillGraph.listCommonSkills(id);
	}
}
