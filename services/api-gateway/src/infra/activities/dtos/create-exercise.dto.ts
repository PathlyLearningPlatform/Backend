import { ApiProperty } from '@nestjs/swagger'
import { CreateActivityDto } from './create.dto'
import { ExerciseDifficulty } from '@pathly-backend/contracts/learning-paths/v1/activities.js'

export class CreateExerciseDto extends CreateActivityDto {
	@ApiProperty({
		enum: ExerciseDifficulty,
	})
	difficulty: ExerciseDifficulty
}
