import { ApiProperty } from '@nestjs/swagger'
import { UnitProgressResponseDto } from '../response.dto'

export class ListUnitProgressResponseDto {
	@ApiProperty({ type: [UnitProgressResponseDto] })
	unitProgress: UnitProgressResponseDto[]
}
