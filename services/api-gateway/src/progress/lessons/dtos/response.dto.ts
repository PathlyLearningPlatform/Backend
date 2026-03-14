import { ApiProperty } from '@nestjs/swagger'

export class LessonProgressResponseDto {
	@ApiProperty()
	lessonId: string

	@ApiProperty()
	userId: string

	@ApiProperty({ nullable: true })
	completedAt: string | null

	@ApiProperty()
	totalActivityCount: number

	@ApiProperty()
	completedActivityCount: number
}
