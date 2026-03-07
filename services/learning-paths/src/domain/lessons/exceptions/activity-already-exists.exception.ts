import { DomainException } from '@/domain/common';

export class ActivityAlreadyExistsException extends DomainException {
	constructor(public readonly id: string) {
		const message = `Activity with id = ${id} already exists.`;
		super(message);
	}
}
