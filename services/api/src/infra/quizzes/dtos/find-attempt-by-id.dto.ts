import { ApiProperty } from '@nestjs/swagger';
import { QuizAttemptResponseDto } from './response.dto';

export class FindQuizAttemptByIdResponseDto {
	@ApiProperty({ type: QuizAttemptResponseDto })
	attempt!: QuizAttemptResponseDto;
}
