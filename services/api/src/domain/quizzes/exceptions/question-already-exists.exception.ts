import { DomainException } from "@/domain/common";

export class QuestionAlreadyExistsException extends DomainException {
	constructor(public readonly questionId: string) {
		const message = `Question with id = ${questionId} already exists.`;
		super(message);
	}
}
