import { IntersectionType, OmitType, PartialType } from '@nestjs/mapped-types';
import { Path } from '../entities';

class RequiredFields extends OmitType(Path, [
	'createdAt',
	'updatedAt',
	'id',
	'description',
]) {}
class OptionalFields extends PartialType(
	OmitType(Path, ['createdAt', 'updatedAt', 'id', 'name']),
) {}
class Fields extends IntersectionType(RequiredFields, OptionalFields) {}

export class CreatePathCommand extends Fields {}
