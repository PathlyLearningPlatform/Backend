import { ApiProperty } from '@nestjs/swagger';
import { ExerciseProgressResponseDto } from './response.dto';

export class FindOneExerciseProgressForUserResponseDto {
	@ApiProperty({ type: ExerciseProgressResponseDto })
	data!: ExerciseProgressResponseDto;
}
