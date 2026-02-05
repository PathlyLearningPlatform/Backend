import { ApiProperty } from '@nestjs/swagger'
import { LessonResponseDto } from '../response.dto'

export class FindLessonsResponseDto {
	@ApiProperty({ type: [LessonResponseDto] })
	lessons: LessonResponseDto[]
}
