import { ApiProperty } from '@nestjs/swagger'
import { SkillProgressResponseDto } from '../response.dto'

export class UnlockSkillResponseDto {
	@ApiProperty({ type: SkillProgressResponseDto })
	skillProgress!: SkillProgressResponseDto
}
