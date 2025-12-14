import { ApiProperty } from '@nestjs/swagger'
import { PathResponseDto } from '../response.dto'

export class CreatePathResponseDto {
	@ApiProperty({ type: PathResponseDto })
	path: PathResponseDto
}
