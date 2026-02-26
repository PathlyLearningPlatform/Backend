import { ApiProperty } from '@nestjs/swagger'
import { ActivityProgressResponseDto } from '../response.dto'

export class StartActivityResponseDto {
	@ApiProperty({ type: ActivityProgressResponseDto })
	activityProgress: ActivityProgressResponseDto
}
