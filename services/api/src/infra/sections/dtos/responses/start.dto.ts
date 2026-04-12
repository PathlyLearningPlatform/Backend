import { ApiProperty } from '@nestjs/swagger'
import { SectionProgressResponseDto } from '../response.dto'

export class StartSectionResponseDto {
	@ApiProperty({ type: SectionProgressResponseDto })
	sectionProgress: SectionProgressResponseDto
}
