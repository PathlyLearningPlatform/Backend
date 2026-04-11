import { ApiPropertyOptional } from '@nestjs/swagger'
import { UpdateActivityDto } from './update.dto'

export class UpdateArticleDto extends UpdateActivityDto {
	@ApiPropertyOptional()
	ref?: string
}
