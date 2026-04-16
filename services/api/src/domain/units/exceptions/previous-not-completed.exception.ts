import { DomainException } from '@/domain/common';

export class PreviousUnitNotCompletedException extends DomainException {
	constructor() {
		super('Previous unit was not completed');
	}
}
