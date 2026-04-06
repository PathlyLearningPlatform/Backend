import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { SkillsApiConstraints } from '@/skills/enums'

export class CreateSkillBodyDto {
	@ApiProperty({
		type: 'string',
		minLength: SkillsApiConstraints.MIN_NAME_LENGTH,
	})
	name!: string

	@ApiPropertyOptional({
		type: 'string',
		format: 'uuid',
		nullable: true,
	})
	parentId?: string | null
}

export class AddNextStepBodyDto {
	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	prerequisiteSkillId!: string

	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	targetSkillId!: string
}

export class AddChildBodyDto {
	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	parentSkillId!: string

	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	childSkillId!: string
}
