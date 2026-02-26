import { ApiProperty } from '@nestjs/swagger'

export class ActivityProgressResponseDto {
	@ApiProperty()
	activityId: string

	@ApiProperty()
	userId: string

	@ApiProperty({ nullable: true })
	completedAt: string | null
}
