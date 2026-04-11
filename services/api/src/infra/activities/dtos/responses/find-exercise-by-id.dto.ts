import { ApiProperty } from '@nestjs/swagger'
import { ExerciseResponseDto } from '../response.dto'

export class FindExerciseByIdResponseDto {
	@ApiProperty({ type: ExerciseResponseDto })
	exercise: ExerciseResponseDto
}
