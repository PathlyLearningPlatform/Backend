import { ApiProperty } from '@nestjs/swagger'
import { LessonProgressResponseDto } from '../response.dto'

export class StartLessonResponseDto {
	@ApiProperty({ type: LessonProgressResponseDto })
	lessonProgress: LessonProgressResponseDto
}
