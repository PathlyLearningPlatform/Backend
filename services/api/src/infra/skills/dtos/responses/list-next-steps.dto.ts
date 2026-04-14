import { ApiProperty } from '@nestjs/swagger';
import { SkillResponseDto } from '../response.dto';

export class ListSkillNextStepsResponseDto {
	@ApiProperty({ type: [SkillResponseDto] })
	skills!: SkillResponseDto[];
}
