import { ApiProperty } from '@nestjs/swagger'
import { SectionResponseDto } from '../response.dto'

export class ListSectionsResponseDto {
	@ApiProperty({ type: [SectionResponseDto] })
	sections: SectionResponseDto[]
}
