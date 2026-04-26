import { ApiProperty } from '@nestjs/swagger';
import { ProjectProgressResponseDto } from './response.dto';

export class FindOneProjectProgressForUserResponseDto {
	@ApiProperty({ type: ProjectProgressResponseDto })
	projectProgress!: ProjectProgressResponseDto;
}
