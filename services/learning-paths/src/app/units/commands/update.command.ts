import { Unit } from '@domain/units/entities';
import { OmitType, PartialType } from '@nestjs/mapped-types';

class UpdateFields extends PartialType(
	OmitType(Unit, ['createdAt', 'updatedAt', 'id', 'sectionId']),
) {}

export class UpdateUnitCommand {
	where: {
		id: string;
	};
	fields?: UpdateFields;
}
