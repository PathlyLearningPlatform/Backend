import { ApiProperty } from '@nestjs/swagger'
import { UnitResponseDto } from '../response.dto'

export class ListUnitsResponseDto {
	@ApiProperty({ type: [UnitResponseDto] })
	units: UnitResponseDto[]
}
