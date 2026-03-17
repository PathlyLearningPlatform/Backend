import { ApiProperty } from '@nestjs/swagger'

export class SectionProgressResponseDto {
	@ApiProperty()
	id: string

	@ApiProperty()
	sectionId: string

	@ApiProperty()
	learningPathId: string

	@ApiProperty()
	userId: string

	@ApiProperty({ nullable: true })
	completedAt: string | null

	@ApiProperty()
	totalUnitCount: number

	@ApiProperty()
	completedUnitCount: number
}
