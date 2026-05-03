import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExerciseResponseDto } from './response.dto';
import { ExerciseApiConstraints } from '../enums';

export class ListExercisesDto {
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
}

export class ListExercisesResponseDto {
	@ApiProperty({ type: [ExerciseResponseDto] })
	data!: ExerciseResponseDto[];
}
