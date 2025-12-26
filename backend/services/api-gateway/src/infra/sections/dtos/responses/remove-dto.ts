import { ApiProperty } from '@nestjs/swagger'
import { SectionResponseDto } from '../response.dto'

export class RemoveSectionResponseDto {
	@ApiProperty({ type: SectionResponseDto })
	section: SectionResponseDto
}
