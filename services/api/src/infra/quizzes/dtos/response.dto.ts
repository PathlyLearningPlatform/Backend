import { ApiProperty } from '@nestjs/swagger';
import { ActivityResponseDto } from '@infra/activities/dtos';

export class QuestionResponseDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	quizId: string;

	@ApiProperty()
	order: number;

	@ApiProperty()
	content: string;

	@ApiProperty()
	correctAnswer: string;
}

export class QuizResponseDto extends ActivityResponseDto {
	@ApiProperty({
		type: [QuestionResponseDto],
	})
	questions: QuestionResponseDto[];
}

export class UserAnswerResponseDto {
	@ApiProperty()
	questionId: string;

	@ApiProperty()
	isCorrect: boolean;

	@ApiProperty()
	text: string;
}

export class QuizAttemptResponseDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	userId: string;

	@ApiProperty()
	quizId: string;

	@ApiProperty()
	score: number;

	@ApiProperty()
	attemptedAt: string;

	@ApiProperty({ type: [UserAnswerResponseDto] })
	answers: UserAnswerResponseDto[];
}
