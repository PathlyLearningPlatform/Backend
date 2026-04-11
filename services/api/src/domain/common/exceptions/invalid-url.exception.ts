import { ValidationException } from "./validation.exception";

export class InvalidUrlException extends ValidationException {
	constructor(public readonly url: string) {
		super(`Url ${url} is invalid`);
	}
}
