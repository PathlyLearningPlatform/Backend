import { SectionResponseDto } from '../response.dto'
import { ApiProperty } from '@nestjs/swagger'

export class RemoveSectionResponseDto {
	@ApiProperty({ type: SectionResponseDto })
	section: SectionResponseDto
}
