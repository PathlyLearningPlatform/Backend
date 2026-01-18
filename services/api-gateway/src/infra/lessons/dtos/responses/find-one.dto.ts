import { ApiProperty } from '@nestjs/swagger'
import { LessonResponseDto } from '../response.dto'

export class FindOneLessonResponseDto {
	@ApiProperty({ type: LessonResponseDto })
	lesson: LessonResponseDto
}
