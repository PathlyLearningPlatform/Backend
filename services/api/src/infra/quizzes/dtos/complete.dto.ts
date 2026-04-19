import { ApiProperty } from '@nestjs/swagger';
import { QuizAttemptResponseDto } from './response.dto';

class Answer {
	@ApiProperty()
	questionId!: string;

	@ApiProperty()
	text!: string;
}

export class CompleteQuizDto {
	@ApiProperty()
	quizId!: string;

	@ApiProperty({ type: [Answer] })
	answers!: Answer[];
}

export class CompleteQuizResponseDto {
	@ApiProperty({ type: QuizAttemptResponseDto })
	attempt!: QuizAttemptResponseDto;
}
