import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Path } from '@domain/paths/entities';

class UpdateFields extends PartialType(
	OmitType(Path, ['createdAt', 'updatedAt', 'id']),
) {}

/**
 * @description
 * This class represents data needed (required and optional) to update path entity. It includes filtering and fields to update.
 */
export class UpdatePathCommand {
	where: {
		id: string;
	};
	fields?: UpdateFields;
}
