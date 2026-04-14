import { ApiProperty } from '@nestjs/swagger';
import { SkillResponseDto } from '../response.dto';

export class ListSkillChildrenResponseDto {
	@ApiProperty({ type: [SkillResponseDto] })
	skills!: SkillResponseDto[];
}
