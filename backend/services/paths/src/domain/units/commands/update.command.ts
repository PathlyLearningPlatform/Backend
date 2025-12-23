import { Unit } from '../entities';
import { PartialType, OmitType } from '@nestjs/mapped-types';

class UpdateFields extends PartialType(
	OmitType(Unit, ['createdAt', 'updatedAt', 'id', 'sectionId']),
) {}

export class UpdateUnitCommand {
	where: {
		id: string;
	};
	fields?: UpdateFields;
}
