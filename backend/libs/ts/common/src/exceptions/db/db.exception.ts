import { AppException } from "../app.exception.js"

export class DbException extends AppException {
	constructor(message: string, cause: unknown, isOperational: boolean) {
		super(message, isOperational, cause)
	}
}