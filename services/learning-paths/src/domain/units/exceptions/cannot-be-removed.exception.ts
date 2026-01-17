import { UnitException } from './base.exception';

export class UnitCannotBeRemovedException extends UnitException {
	constructor(unitId: string) {
		const message = `Unit ${unitId} cannot be removed, because it has lessons.`;

		super(message);
	}
}
