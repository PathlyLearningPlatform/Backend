import { ExerciseSubmissionStatus } from '@/domain/exercises';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExerciseApiConstraints } from '../enums';
import { ExerciseSubmissionResponseDto } from './response.dto';

export class ListExerciseSubmissionsQueryDto {
	@ApiPropertyOptional({
		type: 'number',
		minimum: 1,
		default: ExerciseApiConstraints.DEFAULT_LIMIT,
	})
	limit?: number;

	@ApiPropertyOptional({
		type: 'number',
		minimum: 0,
		default: ExerciseApiConstraints.DEFAULT_PAGE,
	})
	page?: number;

	@ApiPropertyOptional({ enum: ExerciseSubmissionStatus })
	status?: ExerciseSubmissionStatus;
}

export class ListExerciseSubmissionsResponseDto {
	@ApiProperty({ type: [ExerciseSubmissionResponseDto] })
	data!: ExerciseSubmissionResponseDto[];
}
