import { UnitException } from './unit.exception';

export class UnitNotFoundException extends UnitException {
	constructor(unitId: string) {
		const message = `unit with id = ${unitId} not found`;

		super(message);

		this.message = message;
	}
}
