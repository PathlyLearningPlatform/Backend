import { ApiProperty } from '@nestjs/swagger'
import { SectionProgressResponseDto } from '../response.dto'

export class ListSectionProgressResponseDto {
	@ApiProperty({ type: [SectionProgressResponseDto] })
	sectionProgress: SectionProgressResponseDto[]
}
