import { UserId } from '../../common';
import { SkillProgress, SkillProgressId } from '..';

export interface ISkillProgressGraph {
	save(aggregate: SkillProgress): Promise<void>;
	load(id: SkillProgressId): Promise<SkillProgress | null>;
	remove(id: SkillProgressId): Promise<boolean>;

	findForUser(userId: UserId): Promise<SkillProgress[]>;
}
