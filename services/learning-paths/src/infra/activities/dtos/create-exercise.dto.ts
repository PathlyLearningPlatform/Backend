import { ApiProperty } from '@nestjs/swagger'
import { CreateActivityDto } from './create.dto'
import { ExerciseDifficulty } from '../enums'

export class CreateExerciseDto extends CreateActivityDto {
	@ApiProperty({
		enum: ExerciseDifficulty,
	})
	difficulty: ExerciseDifficulty
}
