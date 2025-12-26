import { ApiProperty } from '@nestjs/swagger'
import { PathResponseDto } from '../response.dto'

export class FindPathsResponseDto {
	@ApiProperty({ type: [PathResponseDto] })
	paths: PathResponseDto[]
}
