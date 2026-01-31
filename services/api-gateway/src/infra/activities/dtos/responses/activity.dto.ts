import { ApiProperty } from '@nestjs/swagger'
import { ActivityResponseDto } from '../response.dto'

export class ActivityResponse {
	@ApiProperty({ type: ActivityResponseDto })
	activity: ActivityResponseDto
}
