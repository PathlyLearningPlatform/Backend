import { ApiPropertyOptional } from '@nestjs/swagger'

export class ListUnitProgressQueryDto {
	@ApiPropertyOptional()
	limit?: number

	@ApiPropertyOptional()
	page?: number
}
