import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Section } from '../entities';

class UpdateFields extends PartialType(
	OmitType(Section, ['createdAt', 'updatedAt', 'id', 'pathId']),
) {}

/**
 * @description
 * This class represents data for updating section.
 */
export class UpdateSectionComand {
	where: {
		id: string;
	};
	fields?: UpdateFields;
}
