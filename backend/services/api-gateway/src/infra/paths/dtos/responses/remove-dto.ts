import { ApiProperty } from '@nestjs/swagger'
import { PathResponseDto } from '../response.dto'

export class RemovePathResponseDto {
	@ApiProperty({ type: PathResponseDto })
	path: PathResponseDto
}
