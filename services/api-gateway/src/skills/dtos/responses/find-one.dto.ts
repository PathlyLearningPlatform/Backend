import { ApiProperty } from '@nestjs/swagger'
import { SkillResponseDto } from '../response.dto'

export class FindOneSkillResponseDto {
	@ApiProperty({ type: SkillResponseDto })
	skill!: SkillResponseDto
}
