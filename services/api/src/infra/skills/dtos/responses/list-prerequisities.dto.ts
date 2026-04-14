import { ApiProperty } from '@nestjs/swagger';
import { SkillResponseDto } from '../response.dto';

export class ListSkillPrerequisitiesResponseDto {
	@ApiProperty({ type: [SkillResponseDto] })
	skills!: SkillResponseDto[];
}
