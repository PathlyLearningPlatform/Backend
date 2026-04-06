import { DomainException } from "../domain-exception";

export class ValidationException extends DomainException {
	constructor(public readonly message) {
		super(message);
	}
}
