import { DomainException } from '@/domain/common';

export class SkillCannotReferenceItselfException extends DomainException {
	constructor() {
		super('Skill cannot reference itself');
	}
}
