import { PathResponseDto } from '../response.dto'
import { ApiProperty } from '@nestjs/swagger'

export class FindOnePathResponseDto {
	@ApiProperty({ type: PathResponseDto })
	path: PathResponseDto
}
