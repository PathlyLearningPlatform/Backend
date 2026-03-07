import { DomainException } from '@/domain/common';

export class SectionCannotBeRemovedException extends DomainException {
	constructor(public readonly sectionId: string) {
		const message = `Section with id = ${sectionId} cannot be removed.`;
		super(message);
	}
}
