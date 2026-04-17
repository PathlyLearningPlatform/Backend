import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateActivityDto } from '@infra/activities/dtos/update.dto';
import type { ExerciseDifficulty } from '@infra/activities/enums';
import { ExerciseResponseDto } from './response.dto';

export class UpdateExerciseDto extends UpdateActivityDto {
	@ApiPropertyOptional()
	difficulty?: ExerciseDifficulty;
}

export class UpdateExerciseResponseDto {
	@ApiProperty({ type: ExerciseResponseDto })
	exercise: ExerciseResponseDto;
}
