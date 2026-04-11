import { ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateActivityDto } from './update.dto';
import { ExerciseDifficulty } from '../enums';

export class UpdateExerciseDto extends UpdateActivityDto {
	@ApiPropertyOptional()
	difficulty?: ExerciseDifficulty;
}
