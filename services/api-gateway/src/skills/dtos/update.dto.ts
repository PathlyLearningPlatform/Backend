import { ApiPropertyOptional } from '@nestjs/swagger'
import { SkillsApiConstraints } from '@/skills/enums'

export class UpdateSkillBodyDto {
	@ApiPropertyOptional({
		type: 'string',
		minLength: SkillsApiConstraints.MIN_NAME_LENGTH,
	})
	name?: string
}
