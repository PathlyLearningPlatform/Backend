import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Section } from '@domain/sections/entities';

class UpdateFields extends PartialType(
	OmitType(Section, ['createdAt', 'updatedAt', 'id', 'pathId']),
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
