import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Path } from '../entities';

class UpdateFields extends PartialType(
	OmitType(Path, ['createdAt', 'updatedAt', 'id']),
) {}

export class UpdatePathComand {
	where: {
		id: string;
	};
	fields?: UpdateFields;
}
