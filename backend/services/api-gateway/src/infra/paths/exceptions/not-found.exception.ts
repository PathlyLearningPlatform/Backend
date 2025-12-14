import { PathException } from './path.exception'

export class PathNotFoundException extends PathException {
	constructor(pathId: string) {
		const message = `path with id = ${pathId} not found`

		super(message)

		this.message = message
	}
}
