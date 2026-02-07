import { ApiProperty } from '@nestjs/swagger'
import { ExerciseResponseDto } from '../response.dto'

export class CreateExerciseResponseDto {
	@ApiProperty({ type: ExerciseResponseDto })
	exercise: ExerciseResponseDto
}
