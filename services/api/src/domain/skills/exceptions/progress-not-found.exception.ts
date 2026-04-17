import { DomainException } from '../../common';

export class SkillProgressNotFoundException extends DomainException {
	constructor() {
		super('Skill progress does not exist');
	}
}
