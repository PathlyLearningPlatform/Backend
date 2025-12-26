import { ApiProperty } from '@nestjs/swagger'
import { PathResponseDto } from '../response.dto'

export class FindOnePathResponseDto {
	@ApiProperty({ type: PathResponseDto })
	path: PathResponseDto
}
