import { ApiProperty } from '@nestjs/swagger'
import { SectionResponseDto } from '../response.dto'

export class FindSectionsResponseDto {
	@ApiProperty({ type: [SectionResponseDto] })
	sections: SectionResponseDto[]
}
