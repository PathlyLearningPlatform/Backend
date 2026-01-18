import { ApiProperty } from '@nestjs/swagger'
import { LessonResponseDto } from '../response.dto'

export class CreateLessonResponseDto {
	@ApiProperty({ type: LessonResponseDto })
	lesson: LessonResponseDto
}
