import { ApiProperty } from '@nestjs/swagger'
import { SectionResponseDto } from '../response.dto'

export class CreateSectionResponseDto {
	@ApiProperty({ type: SectionResponseDto })
	section: SectionResponseDto
}
