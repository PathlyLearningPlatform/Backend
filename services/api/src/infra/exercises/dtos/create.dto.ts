import { ApiProperty } from '@nestjs/swagger';
import { CreateActivityDto } from '@infra/activities/dtos/create.dto';
import { ExerciseDifficulty } from '@infra/activities/enums';
import { ExerciseResponseDto } from './response.dto';

export class CreateExerciseDto extends CreateActivityDto {
	@ApiProperty({
		enum: ExerciseDifficulty,
	})
	difficulty: ExerciseDifficulty;
}

export class CreateExerciseResponseDto {
	@ApiProperty({ type: ExerciseResponseDto })
	exercise: ExerciseResponseDto;
}
