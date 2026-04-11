import { ApiProperty } from '@nestjs/swagger'
import { ExerciseResponseDto } from '../response.dto'

export class UpdateExerciseResponseDto {
	@ApiProperty({ type: ExerciseResponseDto })
	exercise: ExerciseResponseDto
}
