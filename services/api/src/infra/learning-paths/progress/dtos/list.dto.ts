import { ApiPropertyOptional } from '@nestjs/swagger'

export class ListLearningPathProgressQueryDto {
	@ApiPropertyOptional()
	limit?: number

	@ApiPropertyOptional()
	page?: number
}
