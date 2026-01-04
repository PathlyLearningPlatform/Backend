import { Section } from '@domain/sections/entities';
import { OmitType, PartialType } from '@nestjs/mapped-types';

class UpdateFields extends PartialType(
	OmitType(Section, ['createdAt', 'updatedAt', 'id', 'learningPathId']),
) {}

/**
 * @description
 * This class represents data for updating section.
 */
export class UpdateSectionCommand {
	where: {
		id: string;
	};
	fields?: UpdateFields;
}
