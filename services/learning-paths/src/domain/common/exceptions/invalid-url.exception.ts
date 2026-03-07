import { DomainException } from '../domain-exception';

export class InvalidUrlException extends DomainException {
	constructor(public readonly url: number) {
		super(`Url ${url} is invalid`);
	}
}
