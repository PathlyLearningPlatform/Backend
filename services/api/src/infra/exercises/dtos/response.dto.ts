import { ApiProperty } from '@nestjs/swagger';
import { ActivityResponseDto } from '@infra/activities/dtos';
import { ExerciseDifficulty } from '@infra/activities/enums';

export class ExerciseResponseDto extends ActivityResponseDto {
	@ApiProperty({
		enum: ExerciseDifficulty,
	})
	difficulty: ExerciseDifficulty;
}
