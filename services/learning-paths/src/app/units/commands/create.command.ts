import { Unit } from '@domain/units/entities';
import {
	IntersectionType,
	OmitType,
	PartialType,
	PickType,
} from '@nestjs/mapped-types';

class RequiredFields extends PickType(Unit, ['sectionId', 'name', 'order']) {}
class AllowedFields extends OmitType(Unit, ['createdAt', 'updatedAt', 'id']) {}

export class CreateUnitCommand extends IntersectionType(
	RequiredFields,
	PartialType(AllowedFields),
) {}
