import { DomainException } from "@/domain/common";

export class LearningPathCannotBeRemovedException extends DomainException {
	constructor(public readonly learningPathId: string) {
		const message = `Learning path with id = ${learningPathId} cannot be removed.`;
		super(message);
	}
}
