import { ValidationException } from "./validation.exception";

export class InvalidUUIDException extends ValidationException {
	constructor(public readonly uuid: string) {
		super(`UUID ${uuid} is invalid`);
	}
}
