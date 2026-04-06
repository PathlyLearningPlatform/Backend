import { ApiProperty } from '@nestjs/swagger'

export class SkillProgressResponseDto {
	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	skillId!: string

	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	userId!: string

	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	unlockedAt!: string
}
