import { LearningPathException } from './base.exception';

export class LearningPathCannotBeRemovedException extends LearningPathException {
	constructor(pathId: string) {
		const message = `Path ${pathId} cannot be removed, because it has sections. Before deleting path please remove the sctions.`;

		super(message);
	}
}
