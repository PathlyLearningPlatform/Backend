import { ApiPropertyOptional } from '@nestjs/swagger'

export class ListActivityProgressQueryDto {
	@ApiPropertyOptional()
	limit?: number

	@ApiPropertyOptional()
	page?: number
}
