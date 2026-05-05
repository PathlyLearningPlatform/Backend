import { ApiProperty } from '@nestjs/swagger';

class Metadata {
	@ApiProperty()
	id!: string;

	@ApiProperty()
	name!: string;

	@ApiProperty()
	order!: number;

	@ApiProperty({ format: 'date-time', nullable: true })
	completedAt!: string | null;
}

class Section {
	@ApiProperty()
	id!: string;

	@ApiProperty()
	name!: string;

	@ApiProperty()
	order!: number;

	@ApiProperty()
	totalUnitCount!: number;

	@ApiProperty()
	completedUnitCount!: number;
}

class Unit {
	@ApiProperty()
	id!: string;

	@ApiProperty()
	name!: string;

	@ApiProperty()
	order!: number;

	@ApiProperty()
	totalLessonCount!: number;

	@ApiProperty()
	completedLessonCount!: number;
}

class Lesson {
	@ApiProperty()
	id!: string;

	@ApiProperty()
	name!: string;

	@ApiProperty()
	order!: number;

	@ApiProperty()
	totalActivityCount!: number;

	@ApiProperty()
	completedActivityCount!: number;
}

class Activity {
	@ApiProperty()
	id!: string;

	@ApiProperty()
	name!: string;

	@ApiProperty()
	order!: number;
}

class Current {
	@ApiProperty()
	section!: Section;

	@ApiProperty()
	unit!: Unit;

	@ApiProperty()
	lesson!: Lesson;

	@ApiProperty()
	activity!: Activity;
}

export class LearningPathProgressResponseDto {
	@ApiProperty()
	id!: string;

	@ApiProperty()
	name!: string;

	@ApiProperty()
	totalSectionCount!: number;

	@ApiProperty()
	completedSectionCount!: number;

	@ApiProperty({ type: Current })
	current!: Current;

	@ApiProperty({ type: [Metadata] })
	sectionsInCurrentLearningPath!: Metadata[];

	@ApiProperty({ type: [Metadata] })
	unitsInCurrentSection!: Metadata[];

	@ApiProperty({ type: [Metadata] })
	lessonsInCurrentUnit!: Metadata[];

	@ApiProperty({ type: [Metadata] })
	activitiesInCurrentLesson!: Metadata[];
}
