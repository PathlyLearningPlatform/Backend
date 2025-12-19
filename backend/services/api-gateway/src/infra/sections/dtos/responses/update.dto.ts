import { SectionResponseDto } from '../response.dto'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateSectionResponseDto {
	@ApiProperty({ type: SectionResponseDto })
	section: SectionResponseDto
}
