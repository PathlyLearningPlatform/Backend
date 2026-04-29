import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

export class LearningPathCompletedEventPayload {
	@ApiProperty()
	learningPathId!: string;
}

export class SectionCompletedEventPaylod {
	@ApiProperty()
	learningPathId!: string;

	@ApiProperty()
	sectionId!: string;
}

export class UnitCompletedEventPayload {
	@ApiProperty()
	sectionId!: string;

	@ApiProperty()
	unitId!: string;
}

export class LessonCompletedEventPayload {
	@ApiProperty()
	unitId!: string;

	@ApiProperty()
	lessonId!: string;
}

export class ActivityCompletedEventPayload {
	@ApiProperty()
	lessonId!: string;

	@ApiProperty()
	activityId!: string;
}

export class EventDto {
	@ApiProperty({ nullable: true, type: 'string' })
	public userId!: string | null;

	@ApiProperty({ format: 'date-time' })
	public occuredAt!: string;

	@ApiProperty()
	public name!: string;

	@ApiProperty({
		oneOf: [
			{ $ref: getSchemaPath(LearningPathCompletedEventPayload) },
			{ $ref: getSchemaPath(SectionCompletedEventPaylod) },
			{ $ref: getSchemaPath(UnitCompletedEventPayload) },
			{ $ref: getSchemaPath(LessonCompletedEventPayload) },
			{ $ref: getSchemaPath(ActivityCompletedEventPayload) },
		],
	})
	public payload!:
		| LearningPathCompletedEventPayload
		| SectionCompletedEventPaylod
		| UnitCompletedEventPayload
		| LessonCompletedEventPayload
		| ActivityCompletedEventPayload;
}
