import { Lesson } from '@domain/lessons/entities';
import {
	IntersectionType,
	OmitType,
	PartialType,
	PickType,
} from '@nestjs/mapped-types';

class RequiredFields extends PickType(Lesson, ['unitId', 'name', 'order']) {}
class AllowedFields extends OmitType(Lesson, [
	'createdAt',
	'updatedAt',
	'id',
]) {}

export class CreateLessonCommand extends IntersectionType(
	RequiredFields,
	PartialType(AllowedFields),
) {}
