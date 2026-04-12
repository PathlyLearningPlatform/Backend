import { ApiProperty } from '@nestjs/swagger'
import { SkillProgressResponseDto } from '../response.dto'

export class ListSkillProgressResponseDto {
	@ApiProperty({ type: [SkillProgressResponseDto] })
	skillProgress!: SkillProgressResponseDto[]
}
