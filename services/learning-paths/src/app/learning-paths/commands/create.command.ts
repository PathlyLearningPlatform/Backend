import {
	IntersectionType,
	OmitType,
	PartialType,
	PickType,
} from '@nestjs/mapped-types';
import { LearningPath } from '@/domain/learning-paths/entities';

class RequiredFields extends PickType(LearningPath, ['name']) {}
class AllowedFields extends OmitType(LearningPath, [
	'createdAt',
	'updatedAt',
	'id',
]) {}

/**
 * @description
 * This class represents data needed (required and optional) to create path entity.
 */
export class CreateLearningPathCommand extends IntersectionType(
	RequiredFields,
	PartialType(AllowedFields),
) {}
