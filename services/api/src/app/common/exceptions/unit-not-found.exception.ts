import { AppException } from "./app.exception";

export class UnitNotFoundException extends AppException {
	constructor(public readonly unitId: string) {
		const message = `Unit with id = ${unitId} was not found.`;
		super(message);
	}
}
