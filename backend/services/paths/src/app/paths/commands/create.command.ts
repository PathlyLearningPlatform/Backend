import {
	IntersectionType,
	OmitType,
	PartialType,
	PickType,
} from '@nestjs/mapped-types';
import { Path } from '@domain/paths/entities';

class RequiredFields extends PickType(Path, ['name']) {}
class AllowedFields extends OmitType(Path, ['createdAt', 'updatedAt', 'id']) {}

/**
 * @description
 * This class represents data needed (required and optional) to create path entity.
 */
export class CreatePathCommand extends IntersectionType(
	RequiredFields,
	PartialType(AllowedFields),
) {}
