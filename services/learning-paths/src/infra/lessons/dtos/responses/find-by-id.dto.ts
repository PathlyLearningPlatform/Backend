import { ApiProperty } from '@nestjs/swagger'
import { LessonResponseDto } from '../response.dto'

export class FindLessonByIdResponseDto {
	@ApiProperty({ type: LessonResponseDto })
	lesson: LessonResponseDto
}
