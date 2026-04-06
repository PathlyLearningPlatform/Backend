import { ApiProperty } from '@nestjs/swagger'
import { SkillResponseDto } from '../response.dto'

export class CreateSkillResponseDto {
	@ApiProperty({ type: SkillResponseDto })
	skill!: SkillResponseDto
}
