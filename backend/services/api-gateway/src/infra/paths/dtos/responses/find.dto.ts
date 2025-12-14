import { PathResponseDto } from '../response.dto'
import { ApiProperty } from '@nestjs/swagger'

export class FindPathsResponseDto {
	@ApiProperty({ type: [PathResponseDto] })
	paths: PathResponseDto[]
}
