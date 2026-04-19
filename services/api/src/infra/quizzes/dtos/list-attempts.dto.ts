import { ApiProperty } from '@nestjs/swagger';
import { QuizAttemptResponseDto } from './response.dto';

export class ListQuizAttemptsResponseDto {
	@ApiProperty({ type: [QuizAttemptResponseDto] })
	attempts!: QuizAttemptResponseDto[];
}
