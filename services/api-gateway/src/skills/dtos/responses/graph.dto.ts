import { ApiPropertyOptional } from '@nestjs/swagger'
import { SkillGraphResponseDto } from '../response.dto'

export class GetPrerequisiteGraphResponseDto {
	@ApiPropertyOptional({ type: SkillGraphResponseDto })
	graph?: SkillGraphResponseDto
}
