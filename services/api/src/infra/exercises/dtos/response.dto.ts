import {
	ExerciseDifficulty,
	ExerciseStatus,
	ExerciseSubmissionStatus,
} from '@/domain/exercises';
import { ApiProperty } from '@nestjs/swagger';

export class ExerciseResponseDto {
	@ApiProperty()
	id!: string;

	@ApiProperty()
	repositoryId!: number;

	@ApiProperty()
	name!: string;

	@ApiProperty({ nullable: true })
	description!: string | null;

	@ApiProperty()
	createdAt!: string;

	@ApiProperty({ nullable: true })
	updatedAt!: string | null;

	@ApiProperty()
	acceptUrl!: string;

	@ApiProperty({ enum: ExerciseDifficulty })
	difficulty!: ExerciseDifficulty;
}

export class ExerciseProgressResponseDto {
	@ApiProperty()
	userId!: string;

	@ApiProperty()
	exerciseId!: string;

	@ApiProperty()
	repositoryId!: number;

	@ApiProperty({ nullable: true })
	completedAt!: string | null;

	@ApiProperty({ nullable: true })
	updatedAt!: string | null;

	@ApiProperty({ enum: ExerciseStatus })
	status!: ExerciseStatus;

	@ApiProperty()
	repositoryUrl!: string;
}

export class ExerciseSubmissionResponseDto {
	@ApiProperty()
	id!: string;

	@ApiProperty()
	exerciseId!: string;

	@ApiProperty()
	submittedAt!: string;

	@ApiProperty({ nullable: true })
	updatedAt!: string | null;

	@ApiProperty({ enum: ExerciseSubmissionStatus })
	status!: ExerciseSubmissionStatus;

	@ApiProperty()
	userId!: string;

	@ApiProperty()
	commitSha!: string;
}
