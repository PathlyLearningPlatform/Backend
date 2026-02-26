import { ApiProperty } from '@nestjs/swagger'
import { ActivityProgressResponseDto } from '../response.dto'

export class FindOneActivityProgressResponseDto {
	@ApiProperty({ type: ActivityProgressResponseDto })
	activityProgress: ActivityProgressResponseDto
}
