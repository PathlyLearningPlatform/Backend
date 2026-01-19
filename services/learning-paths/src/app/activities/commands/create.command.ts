import { Activity } from '@/domain/activities/entities';
import {
	IntersectionType,
	OmitType,
	PartialType,
	PickType,
} from '@nestjs/mapped-types';

class RequiredFields extends PickType(Activity, [
	'lessonId',
	'name',
	'order',
	'external',
	'type',
]) {}
class AllowedFields extends OmitType(Activity, [
	'createdAt',
	'updatedAt',
	'id',
]) {}

export class CreateActivityCommand extends IntersectionType(
	RequiredFields,
	PartialType(AllowedFields),
) {}
