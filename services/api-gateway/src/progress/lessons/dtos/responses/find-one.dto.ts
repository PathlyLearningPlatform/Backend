import { ApiProperty } from '@nestjs/swagger'
import { LessonProgressResponseDto } from '../response.dto'

export class FindOneLessonProgressResponseDto {
	@ApiProperty({ type: LessonProgressResponseDto })
	lessonProgress: LessonProgressResponseDto
}
