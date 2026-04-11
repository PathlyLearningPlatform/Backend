import { ApiProperty } from '@nestjs/swagger'
import { UnitProgressResponseDto } from '../response.dto'

export class FindUnitProgressForUserResponseDto {
	@ApiProperty({ type: UnitProgressResponseDto })
	unitProgress: UnitProgressResponseDto
}
