import { ApiProperty } from '@nestjs/swagger'
import { ExerciseResponseDto } from '../response.dto'

export class ExerciseResponse {
	@ApiProperty({ type: ExerciseResponseDto })
	exercise: ExerciseResponseDto
}
