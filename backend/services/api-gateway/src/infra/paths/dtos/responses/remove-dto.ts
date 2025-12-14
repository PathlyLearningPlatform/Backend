import { PathResponseDto } from '../response.dto'
import { ApiProperty } from '@nestjs/swagger'

export class RemovePathResponseDto {
	@ApiProperty({ type: PathResponseDto })
	path: PathResponseDto
}
