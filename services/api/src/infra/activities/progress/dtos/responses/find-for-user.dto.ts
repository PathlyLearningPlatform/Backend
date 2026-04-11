import { ApiProperty } from '@nestjs/swagger'
import { ActivityProgressResponseDto } from '../response.dto'

export class FindActivityProgressForUserResponseDto {
	@ApiProperty({ type: ActivityProgressResponseDto })
	activityProgress: ActivityProgressResponseDto
}
