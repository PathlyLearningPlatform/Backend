import { DomainException } from '../domain-exception';

export class InvalidOrderException extends DomainException {
	constructor(public readonly order: number) {
		super(`Order with value = ${order} is invalid`);
	}
}
