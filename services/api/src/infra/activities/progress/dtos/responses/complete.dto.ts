import { ApiProperty } from '@nestjs/swagger'
import { ActivityProgressResponseDto } from '../response.dto'

export class CompleteActivityResponseDto {
	@ApiProperty({ type: ActivityProgressResponseDto })
	activityProgress: ActivityProgressResponseDto
}
