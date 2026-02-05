import { ApiProperty } from '@nestjs/swagger'
import { UnitResponseDto } from '../response.dto'

export class FindUnitsResponseDto {
	@ApiProperty({ type: [UnitResponseDto] })
	units: UnitResponseDto[]
}
