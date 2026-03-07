import { DomainException } from '../domain-exception';

export class InvalidUUIDException extends DomainException {
	constructor(public readonly uuid: string) {
		super(`UUID ${uuid} is invalid`);
	}
}
