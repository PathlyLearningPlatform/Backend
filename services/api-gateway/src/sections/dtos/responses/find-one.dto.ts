import { ApiProperty } from '@nestjs/swagger'
import { SectionResponseDto } from '../response.dto'

export class FindOneSectionResponseDto {
	@ApiProperty({ type: SectionResponseDto })
	section: SectionResponseDto
}
