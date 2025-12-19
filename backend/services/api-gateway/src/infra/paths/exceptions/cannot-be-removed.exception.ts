import { PathException } from './path.exception';

export class PathCannotBeRemovedException extends PathException {
	constructor(pathId: string) {
		const message = `Path ${pathId} cannot be removed, because it has sections. Before deleting path please remove the sctions.`;

		super(message);
	}
}
