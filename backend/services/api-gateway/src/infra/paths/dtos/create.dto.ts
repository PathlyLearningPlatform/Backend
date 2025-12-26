import { ApiProperty } from '@nestjs/swagger'
import { PathConstraints } from '@/domain/paths/enums'

export class CreatePathBodyDto {
	@ApiProperty({
		type: 'string',
		maxLength: PathConstraints.MAX_NAME_LENGTH,
	})
	name: string

	@ApiProperty({
		type: 'string',
		maxLength: PathConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description?: string | null
}
