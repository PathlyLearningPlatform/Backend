import { ApiProperty } from '@nestjs/swagger'
import { ExerciseResponseDto } from '../response.dto'

export class ExercisesResponse {
	@ApiProperty({ type: [ExerciseResponseDto] })
	exercises: ExerciseResponseDto[]
}
