import { ApiProperty } from '@nestjs/swagger'
import { LessonResponseDto } from '../response.dto'

export class UpdateLessonResponseDto {
	@ApiProperty({ type: LessonResponseDto })
	lesson: LessonResponseDto
}
