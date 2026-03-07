import { DomainException } from '@/domain/common';

export class UnitCannotBeRemovedException extends DomainException {
	constructor(public readonly unitId: string) {
		const message = `Unit with id = ${unitId} cannot be removed.`;
		super(message);
	}
}
