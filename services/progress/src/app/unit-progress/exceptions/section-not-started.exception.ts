import { AppException } from '@/app/common';

export class SectionNotStartedException extends AppException {
	constructor(
		public readonly sectionId: string,
		public readonly userId: string,
	) {
		const message = `User with id = ${userId} did not start section with id = ${sectionId}`;

		super(message);
	}
}
