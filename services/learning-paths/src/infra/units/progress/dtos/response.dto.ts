import { ApiProperty } from '@nestjs/swagger'

export class UnitProgressResponseDto {
	@ApiProperty()
	id: string

	@ApiProperty()
	unitId: string

	@ApiProperty()
	sectionId: string

	@ApiProperty()
	userId: string

	@ApiProperty({ nullable: true })
	completedAt: string | null

	@ApiProperty()
	totalLessonCount: number

	@ApiProperty()
	completedLessonCount: number
}
