import { SectionException } from './section.exception'

export class SectionNotFoundException extends SectionException {
	constructor(sectionId: string) {
		const message = `section with id = ${sectionId} not found`

		super(message)

		this.message = message
	}
}
