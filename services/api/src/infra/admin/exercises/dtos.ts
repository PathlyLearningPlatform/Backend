import { ExerciseDifficulty } from '@/domain/exercises';
import { ExerciseResponseDto } from '@/infra/exercises/dtos';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExerciseDto {
	@ApiProperty()
	acceptUrl!: string;

	@ApiProperty()
	name!: string;

	@ApiProperty({ enum: ExerciseDifficulty })
	difficulty!: ExerciseDifficulty;

	@ApiProperty()
	repositoryId!: number;

	@ApiPropertyOptional()
	description?: string;
}
export class CreateExerciseResponseDto {
	@ApiProperty({ type: ExerciseResponseDto })
	data!: ExerciseResponseDto;
}

export class UpdateExerciseDto {
	@ApiPropertyOptional()
	name?: string;

	@ApiPropertyOptional({ nullable: true })
	description?: string | null;

	@ApiPropertyOptional({ enum: ExerciseDifficulty })
	difficulty?: ExerciseDifficulty;
}
export class UpdateExerciseResponseDto {
	@ApiProperty({ type: ExerciseResponseDto })
	data!: ExerciseResponseDto;
}
