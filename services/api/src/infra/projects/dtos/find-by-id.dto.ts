import { ApiProperty } from '@nestjs/swagger';
import { ProjectResponseDto } from './response.dto';

export class FindProjectByIdResponseDto {
	@ApiProperty({ type: ProjectResponseDto })
	project!: ProjectResponseDto;
}
