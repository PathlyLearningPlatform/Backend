import { Skill } from '../skill.aggregate';
import { SkillId } from '../value-objects';

export interface ISkillRepository {
	load(id: SkillId): Promise<Skill | null>;

	save(aggregate: Skill): Promise<void>;

	remove(id: SkillId): Promise<boolean>;
}
