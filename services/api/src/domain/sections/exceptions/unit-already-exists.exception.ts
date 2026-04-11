import { DomainException } from "@/domain/common";

export class UnitAlreadyExistsException extends DomainException {
	constructor(public readonly id: string) {
		const message = `Unit with id = ${id} already exists.`;
		super(message);
	}
}
