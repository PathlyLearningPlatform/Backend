import { ApiProperty } from '@nestjs/swagger'

export class ActivityProgressResponseDto {
	@ApiProperty()
	id: string

	@ApiProperty()
	activityId: string

	@ApiProperty()
	userId: string

	@ApiProperty()
	lessonId: string

	@ApiProperty({ nullable: true })
	completedAt: string | null
}
