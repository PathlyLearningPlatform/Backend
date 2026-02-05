import { ApiPropertyOptional } from '@nestjs/swagger'
import type { ExerciseDifficulty } from '@pathly-backend/contracts/learning-paths/v1/activities.js'
import { UpdateActivityDto } from './update.dto'

export class UpdateExerciseDto extends UpdateActivityDto {
	@ApiPropertyOptional()
	difficulty?: ExerciseDifficulty
}
