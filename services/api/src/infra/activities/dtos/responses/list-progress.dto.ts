import { ApiProperty } from '@nestjs/swagger'
import { ActivityProgressResponseDto } from '../response.dto'

export class ListActivityProgressResponseDto {
	@ApiProperty({ type: [ActivityProgressResponseDto] })
	activityProgress: ActivityProgressResponseDto[]
}
