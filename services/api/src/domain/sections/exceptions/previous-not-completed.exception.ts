import { DomainException } from '@/domain/common';

export class PreviousSectionNotCompletedException extends DomainException {
	constructor() {
		super('Previous section was not completed');
	}
}
