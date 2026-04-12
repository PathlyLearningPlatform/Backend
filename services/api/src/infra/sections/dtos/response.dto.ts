import { ApiProperty } from '@nestjs/swagger';
import { SectionsApiConstraints } from '@infra/sections/enums';

export class SectionResponseDto {
	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	id: string;

	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	learningPathId: string;

	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	createdAt: string;

	@ApiProperty({
		type: 'string',
		format: 'date-time',
		nullable: true,
	})
	updatedAt: string | null;

	@ApiProperty({
		type: 'string',
		maxLength: SectionsApiConstraints.MAX_NAME_LENGTH,
	})
	name: string;

	@ApiProperty({
		type: 'string',
		maxLength: SectionsApiConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description: string | null;

	@ApiProperty({
		type: 'number',
	})
	order: number;

	@ApiProperty()
	unitCount: number;
}

export class SectionProgressResponseDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	sectionId: string;

	@ApiProperty()
	learningPathId: string;

	@ApiProperty()
	userId: string;

	@ApiProperty({ nullable: true })
	completedAt: string | null;

	@ApiProperty()
	totalUnitCount: number;

	@ApiProperty()
	completedUnitCount: number;
}
