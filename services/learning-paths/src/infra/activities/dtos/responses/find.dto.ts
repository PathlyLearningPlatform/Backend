import { ApiProperty } from '@nestjs/swagger'
import { ActivityResponseDto } from '../response.dto'

export class FindActivitiesResponseDto {
	@ApiProperty({ type: [ActivityResponseDto] })
	activities: ActivityResponseDto[]
}
