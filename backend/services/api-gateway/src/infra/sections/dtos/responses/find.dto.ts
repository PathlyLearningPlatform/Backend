import { SectionResponseDto } from '../response.dto'
import { ApiProperty } from '@nestjs/swagger'

export class FindSectionsResponseDto {
	@ApiProperty({ type: [SectionResponseDto] })
	sections: SectionResponseDto[]
}
