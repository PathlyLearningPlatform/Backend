import { ApiProperty } from '@nestjs/swagger'
import { LessonProgressResponseDto } from '../response.dto'

export class FindLessonProgressForUserResponseDto {
	@ApiProperty({ type: LessonProgressResponseDto })
	lessonProgress: LessonProgressResponseDto
}
