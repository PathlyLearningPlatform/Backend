import { ApiProperty } from '@nestjs/swagger';
import { ActivitiesApiConstraints, ActivityType } from '../enums';

export class ActivityResponseDto {
	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	declare id: string;

	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	declare lessonId: string;

	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	declare createdAt: string;

	@ApiProperty({
		type: 'string',
		format: 'date-time',
		nullable: true,
	})
	declare updatedAt: string | null;

	@ApiProperty({
		type: 'string',
		maxLength: ActivitiesApiConstraints.MAX_NAME_LENGTH,
	})
	declare name: string;

	@ApiProperty({
		type: 'string',
		maxLength: ActivitiesApiConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	declare description: string | null;

	@ApiProperty({
		type: 'number',
	})
	declare order: number;

	@ApiProperty({
		enum: ActivityType,
	})
	declare type: ActivityType;
}

export class ActivityProgressResponseDto {
	@ApiProperty()
	declare activityId: string;

	@ApiProperty()
	declare lessonId: string;

	@ApiProperty()
	declare userId: string;

	@ApiProperty({ nullable: true })
	declare completedAt: string | null;
}
