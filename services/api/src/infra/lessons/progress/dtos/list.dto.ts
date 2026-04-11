import { ApiPropertyOptional } from '@nestjs/swagger'

export class ListLessonProgressQueryDto {
	@ApiPropertyOptional()
	limit?: number

	@ApiPropertyOptional()
	page?: number
}
