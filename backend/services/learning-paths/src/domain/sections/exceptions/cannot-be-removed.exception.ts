import { SectionException } from './section.exception';

export class SectionCannotBeRemovedException extends SectionException {
	constructor(sectionId: string) {
		const message = `Section ${sectionId} cannot be removed, because it has units.`;

		super(message);
	}
}
