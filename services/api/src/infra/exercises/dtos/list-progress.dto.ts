import { ExerciseStatus } from '@/domain/exercises';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExerciseApiConstraints } from '../enums';
import { ExerciseProgressResponseDto } from './response.dto';

export class ListExerciseProgressQueryDto {
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

	@ApiPropertyOptional({ enum: ExerciseStatus })
	status?: ExerciseStatus;
}

export class ListExerciseProgressResponseDto {
	@ApiProperty({ type: [ExerciseProgressResponseDto] })
	data!: ExerciseProgressResponseDto[];
}
