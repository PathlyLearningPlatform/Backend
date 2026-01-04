import { LearningPathException } from './learning-path.exception';

/**
 * @description This exception is domain exception and should be thrown to when path is not found.
 */
export class LearningPathNotFoundException extends LearningPathException {
	constructor(pathId: string) {
		const message = `path with id = ${pathId} not found`;

		super(message);

		this.message = message;
	}
}
