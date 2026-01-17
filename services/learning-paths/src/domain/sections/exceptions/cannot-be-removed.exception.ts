import { SectionException } from './base.exception';

export class SectionCannotBeRemovedException extends SectionException {
	constructor(sectionId: string) {
		const message = `Section ${sectionId} cannot be removed, because it has units.`;

		super(message);
	}
}
