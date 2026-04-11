import { ApiProperty } from '@nestjs/swagger'
import { CreateActivityDto } from './create.dto'

export class CreateArticleDto extends CreateActivityDto {
	@ApiProperty({
		type: 'string',
	})
	ref: string
}
