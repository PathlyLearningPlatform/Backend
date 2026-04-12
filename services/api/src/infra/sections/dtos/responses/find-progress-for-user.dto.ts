import { ApiProperty } from '@nestjs/swagger'
import { SectionProgressResponseDto } from '../response.dto'

export class FindSectionProgressForUserResponseDto {
	@ApiProperty({ type: SectionProgressResponseDto })
	sectionProgress: SectionProgressResponseDto
}
