import { ApiProperty } from '@nestjs/swagger'
import { ActivityResponseDto } from '../response.dto'

export class FindActivityByIdResponseDto {
	@ApiProperty({ type: ActivityResponseDto })
	activity: ActivityResponseDto
}
