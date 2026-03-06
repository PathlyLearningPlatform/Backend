import { DomainException } from '@/domain/common';

export class SectionAlreadyExistsException extends DomainException {
	constructor(public readonly id: string) {
		const message = `Section with id = ${id} already exists.`;
		super(message);
	}
}
