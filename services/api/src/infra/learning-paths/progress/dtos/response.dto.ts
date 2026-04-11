import { ApiProperty } from '@nestjs/swagger'

export class LearningPathProgressResponseDto {
	@ApiProperty()
	id: string

	@ApiProperty()
	learningPathId: string

	@ApiProperty()
	userId: string

	@ApiProperty({ nullable: true })
	completedAt: string | null

	@ApiProperty()
	totalSectionCount: number

	@ApiProperty()
	completedSectionCount: number
}
