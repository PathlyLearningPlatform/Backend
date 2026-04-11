import { ApiProperty } from '@nestjs/swagger'
import { SectionResponseDto } from '../response.dto'

export class UpdateSectionResponseDto {
	@ApiProperty({ type: SectionResponseDto })
	section: SectionResponseDto
}
