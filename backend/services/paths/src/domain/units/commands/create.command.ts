import {
	IntersectionType,
	OmitType,
	PartialType,
	PickType,
} from '@nestjs/mapped-types';
import { Unit } from '../entities';

class RequiredFields extends PickType(Unit, ['sectionId', 'name', 'order']) {}
class AllowedFields extends OmitType(Unit, ['createdAt', 'updatedAt', 'id']) {}

export class CreateUnitCommand extends IntersectionType(
	RequiredFields,
	PartialType(AllowedFields),
) {}
