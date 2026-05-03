import { ApiProperty } from '@nestjs/swagger';
import { ExerciseSubmissionResponseDto } from './response.dto';

export class FindOneExerciseSubmissionResponseDto {
	@ApiProperty({ type: ExerciseSubmissionResponseDto })
	data!: ExerciseSubmissionResponseDto;
}
