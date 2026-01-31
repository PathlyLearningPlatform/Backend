import { ApiPropertyOptional } from '@nestjs/swagger'
import { UpdateActivityDto } from './update.dto'
import { ExerciseDifficulty } from '@pathly-backend/contracts/learning-paths/v1/activities.js'

export class UpdateExerciseDto extends UpdateActivityDto {
	@ApiPropertyOptional()
	difficulty?: ExerciseDifficulty
}
