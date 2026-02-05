import { ApiProperty } from '@nestjs/swagger'
import { LessonResponseDto } from '../response.dto'

export class RemoveLessonResponseDto {
	@ApiProperty({ type: LessonResponseDto })
	lesson: LessonResponseDto
}
