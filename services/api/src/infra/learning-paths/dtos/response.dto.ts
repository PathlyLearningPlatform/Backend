import { ApiProperty } from '@nestjs/swagger';
import { LearningPathsApiConstraints } from '@infra/learning-paths/enums';

export class LearningPathResponseDto {
	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	id: string;

	@ApiProperty({
		type: 'string',
		maxLength: LearningPathsApiConstraints.MAX_NAME_LENGTH,
	})
	name: string;

	@ApiProperty({
		type: 'string',
		maxLength: LearningPathsApiConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description: string | null;

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

	@ApiProperty()
	sectionCount: number;
}

export class LearningPathProgressResponseDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	learningPathId: string;

	@ApiProperty()
	userId: string;

	@ApiProperty({ nullable: true })
	completedAt: string | null;

	@ApiProperty()
	totalSectionCount: number;

	@ApiProperty()
	completedSectionCount: number;
}
