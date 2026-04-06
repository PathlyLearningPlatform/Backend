import { ApiProperty } from '@nestjs/swagger'
import { SkillRelationshipType } from '@pathly-backend/contracts/skills/v1/skills.js'
import { SkillsApiConstraints } from '@/skills/enums'

export class SkillResponseDto {
	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	id!: string

	@ApiProperty({
		type: 'string',
		minLength: SkillsApiConstraints.MIN_NAME_LENGTH,
	})
	name!: string

	@ApiProperty({
		type: 'string',
		minLength: SkillsApiConstraints.MIN_SLUG_LENGTH,
	})
	slug!: string
}

export class SkillRelationshipResponseDto {
	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	fromId!: string

	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	toId!: string

	@ApiProperty({ enum: SkillRelationshipType })
	type!: SkillRelationshipType
}

export class SkillGraphResponseDto {
	@ApiProperty({ type: [SkillResponseDto] })
	nodes!: SkillResponseDto[]

	@ApiProperty({ type: [SkillRelationshipResponseDto] })
	edges!: SkillRelationshipResponseDto[]
}
