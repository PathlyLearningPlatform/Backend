import { ApiProperty } from '@nestjs/swagger'
import { ActivityResponseDto } from '../response.dto'

export class FindOneActivityResponseDto {
	@ApiProperty({ type: ActivityResponseDto })
	activity: ActivityResponseDto
}
