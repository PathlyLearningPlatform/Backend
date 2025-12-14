import { PathResponseDto } from '../response.dto'
import { ApiProperty } from '@nestjs/swagger'

export class UpdatePathResponseDto {
	@ApiProperty({ type: PathResponseDto })
	path: PathResponseDto
}
