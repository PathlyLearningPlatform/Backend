import { ApiProperty } from '@nestjs/swagger'
import { LessonResponseDto } from '../response.dto'

export class ListLessonsResponseDto {
	@ApiProperty({ type: [LessonResponseDto] })
	lessons: LessonResponseDto[]
}
