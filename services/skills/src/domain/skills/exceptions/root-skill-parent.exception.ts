import { DomainException } from '@/domain/common';

export class RootSkillParentException extends DomainException {
	constructor() {
		super('root skill cannot have a parent');
	}
}
