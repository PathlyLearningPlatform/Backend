import { ApiProperty } from '@nestjs/swagger'
import { SkillResponseDto } from '../response.dto'

export class UpdateSkillResponseDto {
	@ApiProperty({ type: SkillResponseDto })
	skill!: SkillResponseDto
}
