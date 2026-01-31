import { ApiProperty } from '@nestjs/swagger'
import { ActivityResponseDto } from '../response.dto'

export class ActivitiesResponse {
	@ApiProperty({ type: [ActivityResponseDto] })
	activities: ActivityResponseDto[]
}
