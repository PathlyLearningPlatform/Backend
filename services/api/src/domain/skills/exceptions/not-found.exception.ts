import { DomainException } from '../../common';

export class SkillNotFoundException extends DomainException {
	constructor(skillId?: string) {
		super(`Skill ${skillId} does not exist`);
	}
}
