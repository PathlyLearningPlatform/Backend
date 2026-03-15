import { AppException } from '@/app/common';

export class UnitNotStartedException extends AppException {
	constructor(
		public readonly unitId: string,
		public readonly userId: string,
	) {
		const message = `User with id = ${userId} did not complete unit with id = ${unitId}`;

		super(message);
	}
}
