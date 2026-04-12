import { ApiProperty } from '@nestjs/swagger'
import { ActivityResponseDto } from '../response.dto'

export class ListActivitiesResponseDto {
	@ApiProperty({ type: [ActivityResponseDto] })
	activities: ActivityResponseDto[]
}
