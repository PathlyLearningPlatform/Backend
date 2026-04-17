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
