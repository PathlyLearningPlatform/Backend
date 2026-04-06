import { ApiProperty } from '@nestjs/swagger'
import { SkillResponseDto } from '../response.dto'

export class FindSkillsResponseDto {
	@ApiProperty({ type: [SkillResponseDto] })
	skills!: SkillResponseDto[]
}
