import { ValidationException } from './validation.exception';

export class InvalidOrderException extends ValidationException {
	constructor(public readonly order: number) {
		super(`Order with value = ${order} is invalid`);
	}
}
