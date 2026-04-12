import { ApiProperty } from '@nestjs/swagger'
import { SkillProgressResponseDto } from '../response.dto'

export class FindSkillProgressForUserResponseDto {
	@ApiProperty({ type: SkillProgressResponseDto })
	skillProgress!: SkillProgressResponseDto
}
