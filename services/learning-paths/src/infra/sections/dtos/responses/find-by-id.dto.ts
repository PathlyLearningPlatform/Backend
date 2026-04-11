import { ApiProperty } from '@nestjs/swagger'
import { SectionResponseDto } from '../response.dto'

export class FindSectionByIdResponseDto {
	@ApiProperty({ type: SectionResponseDto })
	section: SectionResponseDto
}
