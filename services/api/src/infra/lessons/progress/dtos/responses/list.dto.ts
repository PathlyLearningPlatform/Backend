import { ApiProperty } from '@nestjs/swagger'
import { LessonProgressResponseDto } from '../response.dto'

export class ListLessonProgressResponseDto {
	@ApiProperty({ type: [LessonProgressResponseDto] })
	lessonProgress: LessonProgressResponseDto[]
}
