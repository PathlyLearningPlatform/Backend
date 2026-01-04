import { OmitType, PartialType } from '@nestjs/mapped-types';
import { LearningPath } from '@/domain/learning-paths/entities';

class UpdateFields extends PartialType(
	OmitType(LearningPath, ['createdAt', 'updatedAt', 'id']),
) {}

/**
 * @description
 * This class represents data needed (required and optional) to update path entity. It includes filtering and fields to update.
 */
export class UpdateLearningPathCommand {
	where: {
		id: string;
	};
	fields?: UpdateFields;
}
