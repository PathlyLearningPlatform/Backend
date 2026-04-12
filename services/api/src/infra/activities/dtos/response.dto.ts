import { ApiProperty } from '@nestjs/swagger';
import {
	ActivitiesApiConstraints,
	ActivityType,
	ExerciseDifficulty,
} from '../enums';

export class ActivityResponseDto {
	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	id: string;

	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	lessonId: string;

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
		maxLength: ActivitiesApiConstraints.MAX_NAME_LENGTH,
	})
	name: string;

	@ApiProperty({
		type: 'string',
		maxLength: ActivitiesApiConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description: string | null;

	@ApiProperty({
		type: 'number',
	})
	order: number;

	@ApiProperty({
		enum: ActivityType,
	})
	type: ActivityType;
}

export class ArticleResponseDto extends ActivityResponseDto {
	@ApiProperty({
		type: 'string',
	})
	ref: string;
}

export class QuestionResponseDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	quizId: string;

	@ApiProperty()
	order: number;

	@ApiProperty()
	content: string;

	@ApiProperty()
	correctAnswer: string;
}

export class QuizResponseDto extends ActivityResponseDto {
	@ApiProperty({
		type: [QuestionResponseDto],
	})
	questions: QuestionResponseDto[];
}

export class ExerciseResponseDto extends ActivityResponseDto {
	@ApiProperty({
		enum: ExerciseDifficulty,
	})
	difficulty: ExerciseDifficulty;
}

export class ActivityProgressResponseDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	activityId: string;

	@ApiProperty()
	lessonId: string;

	@ApiProperty()
	userId: string;

	@ApiProperty({ nullable: true })
	completedAt: string | null;
}
