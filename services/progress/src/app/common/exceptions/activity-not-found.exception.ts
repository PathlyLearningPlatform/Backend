export class ActivityNotFoundException extends Error {
	constructor(public readonly id: string) {
		const message = `Activity with id = ${id} not found.`;

		super(message);
	}
}
