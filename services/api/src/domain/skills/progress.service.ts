import { UserId } from '../common';
import { SkillNotFoundException } from './exceptions';
import { ISkillProgressGraph } from './repositories/skill-progress-graph.interface';
import { SkillProgress, SkillProgressId } from '.';
import { SkillGraphService } from './skill.service';

export class SkillProgressService {
	constructor(
		private readonly skillGraphService: SkillGraphService,
		private readonly skillProgressGraph: ISkillProgressGraph,
	) {}

	async unlock(id: SkillProgressId, unlockedAt: Date): Promise<void> {
		const skillId = id.skillId;
		const skill = await this.skillGraphService.findById(skillId);

		if (!skill) {
			throw new SkillNotFoundException(skillId.toString());
		}

		await this.skillProgressGraph.save(
			SkillProgress.create(id, { unlockedAt }),
		);
	}

	async findForUser(userId: UserId) {
		return this.skillProgressGraph.findForUser(userId);
	}

	async findById(id: SkillProgressId): Promise<SkillProgress | null> {
		return this.skillProgressGraph.load(id);
	}
}
