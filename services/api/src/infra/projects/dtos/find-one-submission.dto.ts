import { ApiProperty } from '@nestjs/swagger';
import { ProjectSubmissionResponseDto } from './response.dto';

export class FindOneProjectSubmissionResponseDto {
	@ApiProperty({ type: ProjectSubmissionResponseDto })
	submission!: ProjectSubmissionResponseDto;
}
