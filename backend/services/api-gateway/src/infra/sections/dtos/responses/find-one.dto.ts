import { SectionResponseDto } from '../response.dto'
import { ApiProperty } from '@nestjs/swagger'

export class FindOneSectionResponseDto {
	@ApiProperty({ type: SectionResponseDto })
	section: SectionResponseDto
}
