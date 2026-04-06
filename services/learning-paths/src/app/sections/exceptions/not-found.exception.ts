import { AppException } from "@/app/common";

export class SectionProgressNotFoundException extends AppException {
	constructor(public readonly id: string) {
		const message = `Section progress with id = ${id} was not found`;

		super(message);
	}
}
