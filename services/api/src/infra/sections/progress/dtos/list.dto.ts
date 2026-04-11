import { ApiPropertyOptional } from '@nestjs/swagger'

export class ListSectionProgressQueryDto {
	@ApiPropertyOptional()
	limit?: number

	@ApiPropertyOptional()
	page?: number
}
