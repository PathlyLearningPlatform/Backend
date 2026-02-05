import { ApiProperty } from '@nestjs/swagger'
import { ExerciseDifficulty } from '@pathly-backend/contracts/learning-paths/v1/activities.js'
import { CreateActivityDto } from './create.dto'

export class CreateExerciseDto extends CreateActivityDto {
	@ApiProperty({
		enum: ExerciseDifficulty,
	})
	difficulty: ExerciseDifficulty
}
