import { AppException } from './app.exception';

export class SectionNotFoundException extends AppException {
	constructor(public readonly sectionId: string) {
		const message = `Section with id = ${sectionId} was not found.`;
		super(message);
	}
}
