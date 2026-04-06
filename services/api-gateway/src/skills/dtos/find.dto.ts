import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { SkillsApiConstraints } from '@/skills/enums'

export class FindSkillBySlugQueryDto {
	@ApiProperty({
		type: 'string',
		minLength: SkillsApiConstraints.MIN_SLUG_LENGTH,
	})
	slug!: string
}

export class FindSkillsGraphQueryDto {
	@ApiPropertyOptional({
		type: 'string',
		format: 'uuid',
	})
	parentSkillId?: string
}
