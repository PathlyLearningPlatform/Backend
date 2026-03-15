import { ApiProperty } from '@nestjs/swagger'

export class LessonProgressResponseDto {
	@ApiProperty()
	id: string

	@ApiProperty()
	lessonId: string

	@ApiProperty()
	unitId: string

	@ApiProperty()
	userId: string

	@ApiProperty({ nullable: true })
	completedAt: string | null

	@ApiProperty()
	totalActivityCount: number

	@ApiProperty()
	completedActivityCount: number
}
