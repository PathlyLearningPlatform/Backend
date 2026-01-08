import { Lesson } from '@domain/lessons/entities';
import { OmitType, PartialType } from '@nestjs/mapped-types';

class UpdateFields extends PartialType(
	OmitType(Lesson, ['createdAt', 'updatedAt', 'id', 'unitId']),
) {}

export class UpdateLessonCommand {
	where: {
		id: string;
	};
	fields?: UpdateFields;
}
