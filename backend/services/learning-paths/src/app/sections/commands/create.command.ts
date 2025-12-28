import {
	IntersectionType,
	OmitType,
	PartialType,
	PickType,
} from '@nestjs/mapped-types';
import { Section } from '@domain/sections/entities';

class RequiredFields extends PickType(Section, ['learningPathId', 'name', 'order']) {}
class AllowedFields extends OmitType(Section, [
	'createdAt',
	'updatedAt',
	'id',
]) {}

/**
 * @description
 * This class represents data for creating section.
 */
export class CreateSectionCommand extends IntersectionType(
	RequiredFields,
	PartialType(AllowedFields),
) {}
