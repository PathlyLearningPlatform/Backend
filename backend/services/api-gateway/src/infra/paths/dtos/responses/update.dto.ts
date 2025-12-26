import { ApiProperty } from '@nestjs/swagger'
import { PathResponseDto } from '../response.dto'

export class UpdatePathResponseDto {
	@ApiProperty({ type: PathResponseDto })
	path: PathResponseDto
}
