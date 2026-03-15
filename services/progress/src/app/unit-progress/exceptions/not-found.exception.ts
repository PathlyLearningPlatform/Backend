import { AppException } from '@/app/common';

export class UnitProgressNotFoundException extends AppException {
	constructor(public readonly id: string) {
		const message = `Unit progress with id = ${id} was not found`;

		super(message);
	}
}
