import { AppException } from '@/app/common';

export class ActivityProgressNotFoundException extends AppException {
	constructor(id: string) {
		const message = `Activity progress with id = ${id} was not found`;

		super(message);
	}
}
